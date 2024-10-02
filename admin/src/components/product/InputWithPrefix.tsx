// components/product/InputWithPrefix.tsx
import { Input } from "@/components/ui/input";

interface InputWithPrefixProps {
  id: string;
  value: string | number;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; // Adicionando a propriedade placeholder como opcional
}

export default function InputWithPrefix({
  id,
  value,
  onChange,
  placeholder, // Recebendo o placeholder
}: InputWithPrefixProps) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1 text-gray-500">R$</span>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className="pl-10"
        placeholder={placeholder} // Usando o placeholder
      />
    </div>
  );
}
