interface FullMessageWrappedProps {
  children: React.ReactNode;
}

export const FullMessageWrapped = ({ children }: FullMessageWrappedProps) => {
  return (
    <div className="flex flex-col min-h-svh w-full items-center justify-center p-6 md:p-10 bg-green-50">
      {children}
    </div>
  );
};
