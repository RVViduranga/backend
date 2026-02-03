/**
 * User Mock Data
 * 2 Complete User Profiles with Individual Data
 */

import type {
  UserProfileModel as UserProfile,
  EducationModel as Education,
  ExperienceModel as Experience,
  MediaFileModel as MediaFile,
  CVModel as UserCV,
  DashboardStatModel as DashboardStat,
} from "@/models/user-profile";

// ============================================================================
// USER 1: Anya Sharma - Senior Software Engineer
// ============================================================================

export const MOCK_USER_PROFILE_1: UserProfile = {
  id: "user_001",
  fullName: "Anya Sharma",
  email: "anya.sharma@example.com",
  phone: "+94 77 123 4567",
  headline: "Senior Software Engineer specializing in scalable web interfaces.",
  location: "Colombo",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Moratuwa",
      degree: "Master of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2018",
      endDate: "2020",
    },
    {
      institution: "University of Colombo",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2014",
      endDate: "2018",
    },
  ],
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "TechGlobal Inc.",
      location: "Colombo",
      startDate: "2022",
      endDate: null,
      description:
        "Led development for major feature releases using React, Node, and AWS serverless architecture. Improved system latency by 30% through targeted backend optimizations.",
    },
    {
      title: "Software Engineer",
      company: "WebConnect Start-up",
      location: "Colombo",
      startDate: "2020",
      endDate: "2022",
      description:
        "Developed and maintained the core user authentication system and managed database migrations (PostgreSQL).",
    },
  ],
};

// ============================================================================
// USER 2: John Doe - Data Analyst
// ============================================================================

export const MOCK_USER_PROFILE_2: UserProfile = {
  id: "user_002",
  fullName: "John Doe",
  email: "john.doe@example.com",
  phone: "+94 77 987 6543",
  headline: "Data Analyst with expertise in financial analytics and business intelligence.",
  location: "Kandy",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Peradeniya",
      degree: "Bachelor of Science",
      fieldOfStudy: "Statistics",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  experience: [
    {
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Kandy",
      startDate: "2021",
      endDate: null,
      description:
        "Analyze financial data and create business intelligence reports. Implemented data visualization dashboards that improved decision-making by 40%.",
    },
  ],
};

// ============================================================================
// USER 3: John Smith - Senior Full Stack Developer
// ============================================================================

export const MOCK_USER_PROFILE_3: UserProfile = {
  id: "user_app_001",
  fullName: "John Smith",
  email: "john.smith@example.com",
  phone: "+94 77 234 5678",
  headline: "Senior Full Stack Developer specializing in React, Node.js, and cloud architecture.",
  location: "Colombo",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Moratuwa",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2015",
      endDate: "2019",
    },
  ],
  experience: [
    {
      title: "Senior Full Stack Developer",
      company: "Tech Innovations Ltd",
      location: "Colombo",
      startDate: "2021",
      endDate: null,
      description:
        "Lead development of scalable web applications using React, Node.js, and MongoDB. Mentored junior developers and implemented CI/CD pipelines.",
    },
    {
      title: "Full Stack Developer",
      company: "Digital Solutions Co.",
      location: "Colombo",
      startDate: "2019",
      endDate: "2021",
      description:
        "Developed RESTful APIs and responsive front-end interfaces. Collaborated with cross-functional teams to deliver high-quality software solutions.",
    },
  ],
};

// ============================================================================
// USER 4: Sarah Johnson - Mid-Level Developer
// ============================================================================

export const MOCK_USER_PROFILE_4: UserProfile = {
  id: "user_app_002",
  fullName: "Sarah Johnson",
  email: "sarah.j@example.com",
  phone: "+94 77 345 6789",
  headline: "Mid-Level Full Stack Developer with expertise in modern web technologies.",
  location: "Kandy",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Peradeniya",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2017",
      endDate: "2021",
    },
  ],
  experience: [
    {
      title: "Full Stack Developer",
      company: "WebTech Solutions",
      location: "Kandy",
      startDate: "2021",
      endDate: null,
      description:
        "Developed and maintained web applications using React and Node.js. Implemented responsive designs and optimized application performance.",
    },
  ],
};

// ============================================================================
// USER 5: Michael Chen - Senior Developer
// ============================================================================

export const MOCK_USER_PROFILE_5: UserProfile = {
  id: "user_app_003",
  fullName: "Michael Chen",
  email: "m.chen@example.com",
  phone: "+94 77 456 7890",
  headline: "Senior Software Engineer with strong background in enterprise applications.",
  location: "Galle",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Moratuwa",
      degree: "Master of Science",
      fieldOfStudy: "Software Engineering",
      startDate: "2016",
      endDate: "2018",
    },
    {
      institution: "University of Colombo",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2012",
      endDate: "2016",
    },
  ],
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Enterprise Solutions Inc.",
      location: "Galle",
      startDate: "2020",
      endDate: null,
      description:
        "Architected and developed large-scale enterprise applications. Led technical design decisions and code reviews for the development team.",
    },
    {
      title: "Software Engineer",
      company: "CodeCraft Technologies",
      location: "Colombo",
      startDate: "2018",
      endDate: "2020",
      description:
        "Built scalable backend services using Node.js and PostgreSQL. Implemented microservices architecture for improved system performance.",
    },
  ],
};

// ============================================================================
// USER 6: Emma Williams - Data Analyst
// ============================================================================

export const MOCK_USER_PROFILE_6: UserProfile = {
  id: "user_app_004",
  fullName: "Emma Williams",
  email: "emma.w@example.com",
  phone: "+94 77 567 8901",
  headline: "Data Analyst specializing in financial analytics and business intelligence.",
  location: "Colombo",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Peradeniya",
      degree: "Bachelor of Science",
      fieldOfStudy: "Statistics",
      startDate: "2018",
      endDate: "2022",
    },
  ],
  experience: [
    {
      title: "Data Analyst",
      company: "Financial Insights Ltd",
      location: "Colombo",
      startDate: "2022",
      endDate: null,
      description:
        "Analyze financial data and create comprehensive reports using SQL, Python, and Excel. Develop data visualization dashboards for stakeholders.",
    },
  ],
};

// ============================================================================
// USER 7: David Brown - Data Analyst
// ============================================================================

export const MOCK_USER_PROFILE_7: UserProfile = {
  id: "user_app_005",
  fullName: "David Brown",
  email: "david.brown@example.com",
  phone: "+94 77 678 9012",
  headline: "Mid-Level Data Analyst with expertise in statistical analysis and reporting.",
  location: "Negombo",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Kelaniya",
      degree: "Bachelor of Science",
      fieldOfStudy: "Mathematics",
      startDate: "2017",
      endDate: "2021",
    },
  ],
  experience: [
    {
      title: "Data Analyst",
      company: "Analytics Pro",
      location: "Negombo",
      startDate: "2021",
      endDate: null,
      description:
        "Conduct statistical analysis and generate insights from large datasets. Create automated reporting tools using Python and Tableau.",
    },
  ],
};

// ============================================================================
// USER 8: Lisa Anderson - Marketing Professional
// ============================================================================

export const MOCK_USER_PROFILE_8: UserProfile = {
  id: "user_app_006",
  fullName: "Lisa Anderson",
  email: "lisa.a@example.com",
  phone: "+94 77 789 0123",
  headline: "Entry-level Marketing Professional with passion for digital marketing and brand management.",
  location: "Kandy",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Peradeniya",
      degree: "Bachelor of Commerce",
      fieldOfStudy: "Marketing",
      startDate: "2019",
      endDate: "2023",
    },
  ],
  experience: [
    {
      title: "Marketing Intern",
      company: "Creative Marketing Agency",
      location: "Kandy",
      startDate: "2023",
      endDate: null,
      description:
        "Assist in developing marketing campaigns and social media strategies. Create content for various digital platforms and analyze campaign performance.",
    },
  ],
};

// ============================================================================
// USER 9: Robert Taylor - Mid-Level Developer
// ============================================================================

export const MOCK_USER_PROFILE_9: UserProfile = {
  id: "user_app_007",
  fullName: "Robert Taylor",
  email: "r.taylor@example.com",
  phone: "+94 77 890 1234",
  headline: "Mid-Level Full Stack Developer with expertise in React and backend development.",
  location: "Colombo",
  avatarUrl:
    "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/67ec96fe-6678-4a47-b3dd-663d1056ea0e.png",
  cvUploaded: true,
  education: [
    {
      institution: "University of Colombo",
      degree: "Bachelor of Science",
      fieldOfStudy: "Computer Science",
      startDate: "2016",
      endDate: "2020",
    },
  ],
  experience: [
    {
      title: "Full Stack Developer",
      company: "DevTech Solutions",
      location: "Colombo",
      startDate: "2020",
      endDate: null,
      description:
        "Develop and maintain web applications using React, Node.js, and PostgreSQL. Implement responsive designs and optimize database queries for better performance.",
    },
  ],
};

// ============================================================================
// USER PROFILES MAP (for easy lookup by user ID)
// ============================================================================

export const MOCK_USER_PROFILES: Record<string, UserProfile> = {
  user_001: MOCK_USER_PROFILE_1,
  user_002: MOCK_USER_PROFILE_2,
  user_app_001: MOCK_USER_PROFILE_3,
  user_app_002: MOCK_USER_PROFILE_4,
  user_app_003: MOCK_USER_PROFILE_5,
  user_app_004: MOCK_USER_PROFILE_6,
  user_app_005: MOCK_USER_PROFILE_7,
  user_app_006: MOCK_USER_PROFILE_8,
  user_app_007: MOCK_USER_PROFILE_9,
};

// Backward compatibility - default to user 1
export const MOCK_USER_PROFILE: UserProfile = MOCK_USER_PROFILE_1;

// ============================================================================
// USER 1 CVs
// ============================================================================

export const MOCK_USER_CVS_1: UserCV[] = [
  {
    id: "cv_001",
    name: "Anya Sharma_Tech_CV_2025.pdf",
    dateUploaded: "2025-11-01",
    isPrimary: true,
    sizeMB: 0.8,
    downloadUrl: "/api/download/cv_001",
  },
  {
    id: "cv_002",
    name: "Anya Sharma_Finance_CV_v2.pdf",
    dateUploaded: "2025-08-15",
    isPrimary: false,
    sizeMB: 1.2,
    downloadUrl: "/api/download/cv_002",
  },
];

// ============================================================================
// USER 2 CVs
// ============================================================================

export const MOCK_USER_CVS_2: UserCV[] = [
  {
    id: "cv_003",
    name: "John Doe_Data_Analyst_CV.pdf",
    dateUploaded: "2025-10-20",
    isPrimary: true,
    sizeMB: 1.0,
    downloadUrl: "/api/download/cv_003",
  },
];

// ============================================================================
// USER 3-9 CVs (Other Candidates)
// ============================================================================

export const MOCK_USER_CVS_3: UserCV[] = [
  {
    id: "cv_004",
    name: "John_Smith_Developer_CV.pdf",
    dateUploaded: "2025-11-10",
    isPrimary: true,
    sizeMB: 0.9,
    downloadUrl: "/api/download/cv_004",
  },
];

export const MOCK_USER_CVS_4: UserCV[] = [
  {
    id: "cv_005",
    name: "Sarah_Johnson_CV.pdf",
    dateUploaded: "2025-11-08",
    isPrimary: true,
    sizeMB: 0.7,
    downloadUrl: "/api/download/cv_005",
  },
];

export const MOCK_USER_CVS_5: UserCV[] = [
  {
    id: "cv_006",
    name: "Michael_Chen_Senior_Developer_CV.pdf",
    dateUploaded: "2025-11-05",
    isPrimary: true,
    sizeMB: 1.1,
    downloadUrl: "/api/download/cv_006",
  },
];

export const MOCK_USER_CVS_6: UserCV[] = [
  {
    id: "cv_007",
    name: "Emma_Williams_Data_Analyst_CV.pdf",
    dateUploaded: "2025-11-12",
    isPrimary: true,
    sizeMB: 0.8,
    downloadUrl: "/api/download/cv_007",
  },
];

export const MOCK_USER_CVS_7: UserCV[] = [
  {
    id: "cv_008",
    name: "David_Brown_Analyst_CV.pdf",
    dateUploaded: "2025-11-11",
    isPrimary: true,
    sizeMB: 0.9,
    downloadUrl: "/api/download/cv_008",
  },
];

export const MOCK_USER_CVS_8: UserCV[] = [
  {
    id: "cv_009",
    name: "Lisa_Anderson_Marketing_CV.pdf",
    dateUploaded: "2025-11-09",
    isPrimary: true,
    sizeMB: 0.6,
    downloadUrl: "/api/download/cv_009",
  },
];

export const MOCK_USER_CVS_9: UserCV[] = [
  {
    id: "cv_010",
    name: "Robert_Taylor_Developer_CV.pdf",
    dateUploaded: "2025-11-07",
    isPrimary: true,
    sizeMB: 0.85,
    downloadUrl: "/api/download/cv_010",
  },
];

// ============================================================================
// USER CVS MAP
// ============================================================================

export const MOCK_USER_CVS_MAP: Record<string, UserCV[]> = {
  user_001: MOCK_USER_CVS_1,
  user_002: MOCK_USER_CVS_2,
  user_app_001: MOCK_USER_CVS_3,
  user_app_002: MOCK_USER_CVS_4,
  user_app_003: MOCK_USER_CVS_5,
  user_app_004: MOCK_USER_CVS_6,
  user_app_005: MOCK_USER_CVS_7,
  user_app_006: MOCK_USER_CVS_8,
  user_app_007: MOCK_USER_CVS_9,
};

// Backward compatibility
export const MOCK_USER_CVS: UserCV[] = MOCK_USER_CVS_1;

// ============================================================================
// USER 1 MEDIA FILES
// ============================================================================

export const MOCK_MEDIA_FILES_1: MediaFile[] = [
  {
    id: "media_001",
    fileName: "Profile_Photo_Anya.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-10-20",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 350,
  },
  {
    id: "media_002",
    fileName: "Project_Apollo_Case_Study.pdf",
    fileType: "Portfolio Document",
    uploadDate: "2025-09-10",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/17b8fd19-c2a8-4b3a-98e2-9dd4fc63622a.png",
    sizeKB: 2900,
  },
  {
    id: "media_003",
    fileName: "Scalability_Report_Summary.docx",
    fileType: "Portfolio Document",
    uploadDate: "2025-07-01",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/4ab894d1-309e-448d-9742-6deb491c6bb8.png",
    sizeKB: 800,
  },
];

// ============================================================================
// USER 2 MEDIA FILES
// ============================================================================

export const MOCK_MEDIA_FILES_2: MediaFile[] = [
  {
    id: "media_004",
    fileName: "John_Doe_Profile.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-11-01",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 280,
  },
  {
    id: "media_005",
    fileName: "Financial_Analysis_Report.pdf",
    fileType: "Portfolio Document",
    uploadDate: "2025-10-15",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/17b8fd19-c2a8-4b3a-98e2-9dd4fc63622a.png",
    sizeKB: 1500,
  },
];

// ============================================================================
// USER 3-9 MEDIA FILES (Other Candidates)
// ============================================================================

export const MOCK_MEDIA_FILES_3: MediaFile[] = [
  {
    id: "media_006",
    fileName: "John_Smith_Portfolio.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-10-25",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 320,
  },
];

export const MOCK_MEDIA_FILES_4: MediaFile[] = [
  {
    id: "media_007",
    fileName: "Sarah_Johnson_Portfolio.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-11-05",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 280,
  },
];

export const MOCK_MEDIA_FILES_5: MediaFile[] = [
  {
    id: "media_008",
    fileName: "Michael_Chen_Portfolio.pdf",
    fileType: "Portfolio Document",
    uploadDate: "2025-10-30",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/17b8fd19-c2a8-4b3a-98e2-9dd4fc63622a.png",
    sizeKB: 2100,
  },
];

export const MOCK_MEDIA_FILES_6: MediaFile[] = [
  {
    id: "media_009",
    fileName: "Emma_Williams_Portfolio.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-11-08",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 310,
  },
];

export const MOCK_MEDIA_FILES_7: MediaFile[] = [
  {
    id: "media_010",
    fileName: "David_Brown_Portfolio.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-11-06",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 295,
  },
];

export const MOCK_MEDIA_FILES_8: MediaFile[] = [
  {
    id: "media_011",
    fileName: "Lisa_Anderson_Portfolio.jpg",
    fileType: "Portfolio Image",
    uploadDate: "2025-11-04",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/cc3a01b4-c36f-4996-8152-0b711dca818e.png",
    sizeKB: 260,
  },
];

export const MOCK_MEDIA_FILES_9: MediaFile[] = [
  {
    id: "media_012",
    fileName: "Robert_Taylor_Portfolio.pdf",
    fileType: "Portfolio Document",
    uploadDate: "2025-11-02",
    url: "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/17b8fd19-c2a8-4b3a-98e2-9dd4fc63622a.png",
    sizeKB: 1850,
  },
];

// ============================================================================
// USER MEDIA FILES MAP
// ============================================================================

export const MOCK_MEDIA_FILES_MAP: Record<string, MediaFile[]> = {
  user_001: MOCK_MEDIA_FILES_1,
  user_002: MOCK_MEDIA_FILES_2,
  user_app_001: MOCK_MEDIA_FILES_3,
  user_app_002: MOCK_MEDIA_FILES_4,
  user_app_003: MOCK_MEDIA_FILES_5,
  user_app_004: MOCK_MEDIA_FILES_6,
  user_app_005: MOCK_MEDIA_FILES_7,
  user_app_006: MOCK_MEDIA_FILES_8,
  user_app_007: MOCK_MEDIA_FILES_9,
};

// Backward compatibility
export const MOCK_MEDIA_FILES: MediaFile[] = MOCK_MEDIA_FILES_1;

// ============================================================================
// DASHBOARD STATS
// ============================================================================

export const MOCK_DASHBOARD_STATS: DashboardStat[] = [
  { iconName: "Briefcase", title: "Applied Jobs", value: 5 },
  { iconName: "Bookmark", title: "Saved Jobs", value: 3 },
  { iconName: "CalendarCheck", title: "Interviews Booked", value: 1 },
];

// ============================================================================
// OTHER CONSTANTS
// ============================================================================

export const MOCK_CV_VISUAL_URL =
  "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/81477f1e-13a2-482f-ab2b-82a735af02b4.png";

export const MOCK_PROFILE_PHOTO_UPLOAD_PLACEHOLDER =
  "https://spark-builder.s3.us-east-1.amazonaws.com/image/2025/11/17/e86e1743-f71a-479b-8dd1-b69ac6c7e369.png";
