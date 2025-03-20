import { useState } from "react";

type Props = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
  title?: string;
};

const FormattedJsonDisplay = ({ json, title = "default" }: Props) => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        className="bg-gray-800 text-green-400 px-4 py-2 rounded-lg"
        onClick={() => setOpen(!open)}
      >
        {title} -{open ? "Close" : "Open"}
      </button>

      {open && (
        <div className="max-w-4xl mx-auto p-4">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-auto">
            <pre className="p-4 text-green-400 whitespace-pre-wrap break-all font-mono text-xs">
              {JSON.stringify(json, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormattedJsonDisplay;
