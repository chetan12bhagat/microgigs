-- Create user roles enum
CREATE TYPE public.app_role AS ENUM ('student', 'client', 'admin');

-- Create user_roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  bio TEXT,
  skills TEXT[],
  hourly_rate DECIMAL(10,2),
  avatar_url TEXT,
  location TEXT,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create gig categories enum
CREATE TYPE public.gig_category AS ENUM (
  'web_development',
  'mobile_development',
  'design',
  'writing',
  'marketing',
  'data_entry',
  'video_editing',
  'other'
);

-- Create gig status enum
CREATE TYPE public.gig_status AS ENUM ('open', 'in_progress', 'completed', 'cancelled');

-- Create gigs table
CREATE TABLE public.gigs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category gig_category NOT NULL,
  budget DECIMAL(10,2) NOT NULL,
  deadline DATE,
  status gig_status DEFAULT 'open' NOT NULL,
  required_skills TEXT[],
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.gigs ENABLE ROW LEVEL SECURITY;

-- Create application status enum
CREATE TYPE public.application_status AS ENUM ('pending', 'accepted', 'rejected', 'withdrawn');

-- Create applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gig_id UUID REFERENCES public.gigs(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cover_letter TEXT,
  proposed_rate DECIMAL(10,2),
  status application_status DEFAULT 'pending' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE(gig_id, student_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE PLPGSQL
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$;

-- Create trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE PLPGSQL
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_gigs_updated_at
  BEFORE UPDATE ON public.gigs
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON public.applications
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- RLS Policies for profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for user_roles
CREATE POLICY "User roles are viewable by everyone"
  ON public.user_roles FOR SELECT
  USING (true);

CREATE POLICY "Only users can insert their own roles during signup"
  ON public.user_roles FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for gigs
CREATE POLICY "Anyone can view open gigs"
  ON public.gigs FOR SELECT
  USING (true);

CREATE POLICY "Clients can insert gigs"
  ON public.gigs FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'client'));

CREATE POLICY "Clients can update their own gigs"
  ON public.gigs FOR UPDATE
  USING (auth.uid() = client_id);

CREATE POLICY "Clients can delete their own gigs"
  ON public.gigs FOR DELETE
  USING (auth.uid() = client_id);

-- RLS Policies for applications
CREATE POLICY "Users can view applications for their gigs or their own applications"
  ON public.applications FOR SELECT
  USING (
    auth.uid() = student_id OR 
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = applications.gig_id 
      AND gigs.client_id = auth.uid()
    )
  );

CREATE POLICY "Students can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (
    auth.uid() = student_id AND 
    public.has_role(auth.uid(), 'student')
  );

CREATE POLICY "Students can update their own applications"
  ON public.applications FOR UPDATE
  USING (auth.uid() = student_id);

CREATE POLICY "Clients can update applications for their gigs"
  ON public.applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.gigs 
      WHERE gigs.id = applications.gig_id 
      AND gigs.client_id = auth.uid()
    )
  );