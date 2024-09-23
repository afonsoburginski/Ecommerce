import React from "react";
import { FaInstagram, FaPhone, FaEnvelope, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-muted/40 py-8">
      <div className="mx-auto max-w-[1320px] px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Fale Conosco Section */}
          <div className="text-left">
            <h4 className="text-lg font-semibold mb-4">Fale Conosco</h4>
            <p className="text-muted-foreground mb-2">
              Estamos aqui para ajudar! Entre em contato conosco:
            </p>
            <p className="flex items-center gap-2 mb-2">
              <FaPhone className="h-5 w-5" /> +55 (XX) XXXXX-XXXX
            </p>
            <p className="flex items-center gap-2">
              <FaEnvelope className="h-5 w-5" /> contato@mundoencantado.com
            </p>
          </div>

          {/* Sitemap Section */}
          <div className="text-left">
            <h4 className="text-lg font-semibold mb-4">Sitemap</h4>
            <div className="flex flex-col space-y-2">
              <Link href="/" className="text-muted-foreground hover:underline">
                Página Inicial
              </Link>
              <Link href="/products" className="text-muted-foreground hover:underline">
                Produtos
              </Link>
              <Link href="/about" className="text-muted-foreground hover:underline">
                Sobre Nós
              </Link>
              <Link href="/contact" className="text-muted-foreground hover:underline">
                Contato
              </Link>
              <Link href="/faq" className="text-muted-foreground hover:underline">
                FAQ
              </Link>
            </div>
          </div>

          {/* Redes Sociais */}
          <div className="text-center">
            <h4 className="text-lg font-semibold mb-4">Siga-nos</h4>
            <div className="flex justify-center gap-4 mb-4">
              <Button variant="outline" size="icon">
                <FaInstagram className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon">
                <Link href="https://wa.me/55XXXXXXXXXXX" target="_blank" rel="noopener noreferrer">
                  <FaWhatsapp className="h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-muted-foreground">
            &copy; {new Date().getFullYear()} Mundo Encantado. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
