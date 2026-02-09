import { useParams } from "react-router-dom";
import BaseLayout from "@/layouts/BaseLayout";
import CommonHeader from "@/components/common/common-header";
import CommonFooter from "@/components/common/common-footer";
import ScrollToTop from "@/components/common/scroll-to-top";
import PublicProfileViewContent from "@/sections/public/public-profile-view/PublicProfileViewContent";

export default function PublicProfileViewPage() {
  const { id } = useParams<{ id: string }>();

  return (
    <BaseLayout
      title={`Profile - JobCenter`}
      description="View professional profile"
    >
      <div className="flex flex-col min-h-screen">
        <CommonHeader variant="default" />
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8 max-w-4xl">
            <PublicProfileViewContent />
          </div>
        </main>
        <CommonFooter variant="full" />
        <ScrollToTop />
      </div>
    </BaseLayout>
  );
}
