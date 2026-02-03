import React from "react";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import JobPostForm from "@/sections/company/job-post-form/JobPostForm";
import JobPostBreadcrumb from "@/sections/company/job-post-form/JobPostBreadcrumb";

export const JobPostFormPage: React.FC = () => {
  return (
    <BaseLayout title="Post a New Job - JobCenter">
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted/20">
        <CommonHeader variant="company" />

        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 lg:py-12">
            <div className="max-w-4xl mx-auto">
              <JobPostBreadcrumb />
              
              <div className="mb-8">
                <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Post a New Job
                </h1>
                <p className="text-lg text-muted-foreground">
                  Fill in the details below to create a new job posting. You'll be able to review and publish it in the next step.
                </p>
              </div>

              <JobPostForm />
            </div>
          </div>
        </main>

        <CommonFooter variant="simple" />
      </div>
    </BaseLayout>
  );
};
