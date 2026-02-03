import ClientSidebarWrapper from "@/components/common/client-sidebar-wrapper";
import CVViewerComponent from "./CVViewerComponent";

export default function CVViewLayout() {
  return (
    <ClientSidebarWrapper variant="user" currentPage="/cv-view">
      <CVViewerComponent />
    </ClientSidebarWrapper>
  );
}
