import { Github, Linkedin, Youtube } from 'lucide-react';

export function Footer() {
  return <footer className="mt-16 bg-[#111] py-12 text-[#f3f0e8]"><div className="site-container grid gap-10 md:grid-cols-2"><div><p className="font-['Space_Grotesk'] text-2xl font-bold">Luís Sandri</p><p className="mt-3 text-lg text-[#bfc4c9]">Tecnologia sem se perder.</p></div><div className="md:text-right"><div className="flex gap-5 md:justify-end"><a aria-label="GitHub" href="https://github.com/luis-sandri"><Github size={20}/></a><a aria-label="LinkedIn" href="https://linkedin.com"><Linkedin size={20}/></a><a aria-label="YouTube" href="https://youtube.com"><Youtube size={20}/></a></div><p className="mt-8 font-mono-tech text-xs text-[#bfc4c9]">status: active</p></div></div></footer>;
}
