import { PlusCircleIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FormEvent, useContext, useState } from "react";
import {
  Channel,
  createChannel,
} from "@/lib/firebase/firestore/channel.firestore";
import { AuthContext, AuthContextType } from "@/provider/AuthProvider";
import { toast } from "sonner";

type Props = {};

const ChatChannelNew = (_props: Props) => {
  const { user } = useContext(AuthContext) as AuthContextType;
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const initChannel = {
    name: "",
    description: "",
    isPublic: true,
  };

  const [channel, setChannel] =
    useState<Omit<Channel, "id" | "createdAt" | "createdBy">>(initChannel);

  const validateForm = () => {
    if (channel.name.length < 3) {
      setError("Il nome del canale deve essere di almeno 3 caratteri");
      return false;
    }
    return true;
  };

  const handleCreateChannel = (e: FormEvent) => {
    e.preventDefault();
    if (!user?.uid) return;

    if (!validateForm()) return;

    setError(null);
    setLoading(true);
    createChannel(channel, user.uid)
      .then((_docRefId) => {
        setIsCreateModalOpen(false);
        // Reset form
        setChannel(initChannel);
        setLoading(false);
        toast("Channel created successfully");
      })
      .catch((error) => {
        console.error("Error creating channel", error);
        setError("Errore nella creazione del canale" + error.message);
        setLoading(false);
      });
  };

  return (
    <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
      <DialogTrigger asChild>
        <div className="w-8 mx-auto">
          <Button variant="outline" className="size-8">
            <PlusCircleIcon className="size-4" />
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Crea nuovo canale</DialogTitle>
          <DialogDescription>
            Crea un nuovo canale per organizzare le conversazioni
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col justify-start space-y-4 text-xs">
          <div>
            <Label
              className="block text-gray-700 text-xs font-bold mb-2"
              htmlFor="channelName"
            >
              Nome canale *
            </Label>
            <Input
              id="channelName"
              type="text"
              value={channel.name}
              onChange={(e) =>
                setChannel({
                  ...channel,
                  name: e.target.value,
                })
              }
              placeholder="es. generale"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div>
            <Label
              className="block text-gray-700 text-xs font-bold mb-2"
              htmlFor="channelDescription"
            >
              Descrizione (opzionale)
            </Label>
            <textarea
              id="channelDescription"
              value={channel.description}
              onChange={(e) =>
                setChannel({
                  ...channel,
                  description: e.target.value,
                })
              }
              placeholder="Di cosa si parla in questo canale?"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows={3}
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={channel.isPublic}
                onChange={(e) =>
                  setChannel({
                    ...channel,
                    isPublic: e.target.checked,
                  })
                }
                className="mr-2"
              />
              <span className="text-xs">Canale pubblico</span>
            </label>
            <p className="text-gray-600 text-xs mt-1">
              I canali pubblici sono visibili a tutti gli utenti
            </p>
          </div>
          <div className="text-red-500 text-xs">{error}</div>
        </div>
        <DialogFooter className="sm:justify-between">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={loading}
            type="button"
            variant="default"
            onClick={handleCreateChannel}
          >
            {loading ? "Creazione in corso..." : "Crea canale"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ChatChannelNew;
