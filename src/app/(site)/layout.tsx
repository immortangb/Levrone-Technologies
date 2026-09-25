import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getServiceGroups, getSettings } from "@/lib/queries";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, serviceGroups] = await Promise.all([getSettings(), getServiceGroups()]);
  return (
    <>
      <Header phone={settings.phone} />
      <main className="flex-1">{children}</main>
      <Footer settings={settings} serviceGroups={serviceGroups} />
    </>
  );
}
