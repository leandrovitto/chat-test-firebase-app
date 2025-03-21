import { PresenceContext, PresenceUser } from "@/provider/PresenceProvider";
import moment from "moment";
import { useContext } from "react";

const StatusUser = ({ user }: { user: PresenceUser }) => {
  return (
    <div className="flex justify-between items-center border-b mt-1 pb-2">
      <div className="flex items-center gap-2">
        <img
          src={
            user?.photoURL ||
            "https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
          }
          className="size-6 rounded-full"
        />
        <div className="text-xs text-gray-500 truncate">
          {typeof user?.displayName === "string" && user?.displayName
            ? user.displayName.substring(0, 10)
            : "Unknown"}
          {user?.displayName && user?.displayName.length > 10 ? "..." : ""}
        </div>
      </div>
      <div className="text-xs text-gray-500 text-right">
        {user.last_changed ? (
          <span>{moment(new Date(user.last_changed)).fromNow()}</span>
        ) : (
          <span></span>
        )}
      </div>
    </div>
  );
};

const ChatStatusUsers = () => {
  const { onlineUsers, offLineUsers } = useContext(PresenceContext);

  return (
    <div className="flex flex-col gap-4 p-4 overflow-y-auto max-h-96">
      {onlineUsers.length > 0 && (
        <div>
          <h4 className="text-sm mb-2">Online Users</h4>
          <div>
            {onlineUsers.map((user, idx) => (
              <StatusUser user={user} key={idx} />
            ))}
          </div>
        </div>
      )}
      {offLineUsers.length > 0 && (
        <div>
          <h4 className="text-sm mb-2">Offline Users</h4>
          <div>
            {offLineUsers.map((user, idx) => (
              <StatusUser user={user} key={idx} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatStatusUsers;
