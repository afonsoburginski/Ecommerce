// src/components/ProductRoot.tsx
export default function ProductRoot({ children }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <main className="w-full max-w-[1320px] mb-2 pt-20">
        <div className="flex flex-col gap-8">
          <div className="flex flex-col md:flex-row gap-8">
            {children[0]}
            {children[1]}
          </div>
          <div className="flex flex-col gap-8">
            {children[2]}
            {children[3]}
          </div>
        </div>
      </main>
    </div>
  );
}
