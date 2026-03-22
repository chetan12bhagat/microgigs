import { db } from "./client";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { DYNAMODB_TABLE_NAME } from "./config";
import { v4 as uuidv4 } from "uuid";

const MOCK_GIGS = [
  {
    title: "iOS Fitness Tracker App",
    description: "Develop a basic iOS fitness tracking application using SwiftUI. Core features should include step counting and workout history visualization.",
    category: "development",
    budget: 8000,
    required_skills: ["Swift", "SwiftUI", "HealthKit"],
    deadline: new Date(Date.now() + 86400000 * 14).toISOString(),
    client_name: "FitPulse Systems",
    client_details: "HealthTech startup focused on student wellness."
  },
  {
    title: "Minimalist Social Media Post Design",
    description: "Create a set of 10 Instagram post templates for a sustainable fashion brand. Needs to be clean and high-premium.",
    category: "design",
    budget: 2500,
    required_skills: ["Figma", "Graphic Design", "Branding"],
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    client_name: "EcoStyle Collective",
    client_details: "Sustainable fashion brand for conscious Gen-Z."
  },
  {
    title: "Tech Review: Latest MacBook Pro",
    description: "Write a 1200-word detailed review of the newest MacBook Pro, focusing on developer productivity and performance metrics.",
    category: "writing",
    budget: 3000,
    required_skills: ["Technical Writing", "Hardware Knowledge", "SEO"],
    deadline: new Date(Date.now() + 86400000 * 4).toISOString(),
    client_name: "DevInsights Mag",
    client_details: "Online tech publication for early-career developers."
  },
  {
    title: "Instagram Growth Strategy for Local Hub",
    description: "Develop a comprehensive 30-day content calendar and growth strategy for a local student community center on Instagram.",
    category: "marketing",
    budget: 4500,
    required_skills: ["Social Media Marketing", "Content Strategy", "Canva"],
    deadline: new Date(Date.now() + 86400000 * 7).toISOString(),
    client_name: "CampusConnect",
    client_details: "Local community hub for student activities."
  },
  {
    title: "Android Inventory Management App",
    description: "Build a simple Android application for a small retail store to manage inventory, including barcode scanning capability.",
    category: "development",
    budget: 6500,
    required_skills: ["Kotlin", "Android SDK", "Firebase"],
    deadline: new Date(Date.now() + 86400000 * 12).toISOString(),
    client_name: "QuickScan Retail",
    client_details: "Small business solution provider."
  },
  {
    title: "E-commerce Website Copywriting",
    description: "Write compelling product descriptions and 'About Us' copy for a new eco-friendly marketplace focused on student lifestyle.",
    category: "writing",
    budget: 3500,
    required_skills: ["Copywriting", "SEO", "Creative Writing"],
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    client_name: "GreenMarket Hub",
    client_details: "Eco-friendly marketplace for students."
  },
  {
    title: "Market Research: EdTech Trends 2024",
    description: "Compile a report on the top 10 EdTech trends for 2024. Include competitor analysis and funding rounds.",
    category: "business",
    budget: 3200,
    required_skills: ["Research", "Business Analysis", "Report Writing"],
    deadline: new Date(Date.now() + 86400000 * 6).toISOString(),
    client_name: "EduForward Ventures",
    client_details: "VC firm focused on educational technology."
  },
  {
    title: "SaaS SEO Strategy Implementation",
    description: "Perform keyword research and on-page SEO optimization for a student-focused productivity SaaS landing page.",
    category: "marketing",
    budget: 5500,
    required_skills: ["SEO", "Google Search Console", "Keyword Research"],
    deadline: new Date(Date.now() + 86400000 * 10).toISOString(),
    client_name: "FocusFlow AI",
    client_details: "AI productivity tool for focused studying."
  },
  {
    title: "React Native Quiz Application",
    description: "Create a cross-platform (iOS and Android) quiz app using React Native with multiple-choice questions and a leaderboard.",
    category: "development",
    budget: 7500,
    required_skills: ["React Native", "TypeScript", "Redux"],
    deadline: new Date(Date.now() + 86400000 * 15).toISOString(),
    client_name: "QuizMaster Pro",
    client_details: "Educational quiz platform founder."
  },
  {
    title: "LinkedIn Branding Guide for Students",
    description: "Design a PDF guide for college students on how to optimize their LinkedIn profiles for internship hunting.",
    category: "marketing",
    budget: 1800,
    required_skills: ["Personal Branding", "LinkedIn Optimization", "Design"],
    deadline: new Date(Date.now() + 86400000 * 3).toISOString(),
    client_name: "CareerPath Academy",
    client_details: "Professional development platform for students."
  },
  {
    title: "Website Content Migration (WP to Next.js)",
    description: "Helping move content from a legacy WordPress site to a new Next.js structured frontend. Focus on metadata and cross-linking.",
    category: "development",
    budget: 7000,
    required_skills: ["JavaScript", "Next.js", "Content Management"],
    deadline: new Date(Date.now() + 86400000 * 8).toISOString(),
    client_name: "LegacyX Digital",
    client_details: "Digital transformation consultancy."
  },
  {
    title: "Email Funnel Setup for Fitness Coach",
    description: "Set up an automated email welcome sequence and weekly newsletter template for a student fitness coach using Mailchimp.",
    category: "marketing",
    budget: 5000,
    required_skills: ["Email Marketing", "Copywriting", "Mailchimp"],
    deadline: new Date(Date.now() + 86400000 * 6).toISOString(),
    client_name: "Peak Performance Hub",
    client_details: "Personal coaching business for student athletes."
  }
];

export const seedMockGigs = async (clientId: string) => {
  console.log("Starting to seed mock gigs...");
  let index = 0;
  for (const gig of MOCK_GIGS) {
    const id = `mock-gig-${index}`;
    try {
      await db.send(new PutCommand({
        TableName: DYNAMODB_TABLE_NAME,
        Item: {
          PK: `GIG#${id}`,
          SK: "METADATA",
          id,
          ...gig,
          client_id: clientId,
          status: "open",
          created_at: new Date().toISOString()
        }
      }));
      console.log(`Successfully seeded gig: ${gig.title}`);
      index++;
    } catch (error) {
      console.error(`Failed to seed gig: ${gig.title}`, error);
    }
  }
};
