import FormattedJsonDisplay from "@/components/molecules/FormattedJsonDisplay";
import { useAuth } from "@/provider/AuthProvider";

type Props = {};

const DashboardPage = (_props: Props) => {
  const { user } = useAuth();

  return (
    <div className="border-4 border-yellow-500 p-8 m-8">
      DashboardPage
      <FormattedJsonDisplay json={user} />
    </div>
  );
};

export default DashboardPage;
