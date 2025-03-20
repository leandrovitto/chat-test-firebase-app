import FormattedJsonDisplay from "@/components/molecules/FormattedJsonDisplay";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { useContext } from "react";

type Props = {};

const DashboardPage = (_props: Props) => {
  const { user } = useContext(AuthContext) as AuthContextType;

  return (
    <div className="border-4 border-yellow-500 p-8 m-8">
      DashboardPage
      <FormattedJsonDisplay json={user} />
    </div>
  );
};

export default DashboardPage;
