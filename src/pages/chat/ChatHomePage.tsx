import { Card, CardContent } from "@/components/ui/card";

const ChatHomePage = () => {
  return (
    <div className="p-8">
      <Card className="p-8">
        <CardContent>
          <h2>Welcome to Chat</h2>
          <div className="text-sm text-gray-500">
            <p>To get started, select a channel from the list on the left.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatHomePage;
