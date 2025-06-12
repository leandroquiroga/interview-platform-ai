import { interviewCovers, mappings } from "@/constants";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const techIconBaseURL = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';
/**
 * Devuelve una ruta de imagen de portada de entrevista seleccionada aleatoriamente.
 * Utiliza el array interviewCovers y genera un índice aleatorio para obtener una portada diferente cada vez.
 * El resultado es una cadena con la ruta relativa a la carpeta /covers.
 */
export const getRandomInterviewCover = () => {
  const randomIndex = Math.floor(Math.random() * interviewCovers.length);
  return `/covers${interviewCovers[randomIndex]}`;
};

/**
 * Normaliza el nombre de una tecnología para que coincida con las claves del objeto mappings.
 * Convierte el texto a minúsculas, elimina la extensión ".js" si existe y reemplaza los espacios por guiones.
 */
const normalizeTech = (tech: string) => {
  const key = tech.toLocaleLowerCase().replace(/\.js$/, '').replace(/\s+/g, '-');
  return mappings[key as keyof typeof mappings]
}

/**
 * Verifica si existe un icono para una tecnología dada en la URL especificada.
 * Realiza una petición HTTP HEAD a la URL del icono y devuelve true si la respuesta es exitosa (status 200).
 * Si ocurre un error o la respuesta no es exitosa, devuelve false.
 */
const checkIconExists = async (url: string) => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Devuelve un array de objetos con el nombre de la tecnología y la URL de su icono correspondiente.
 * Para cada tecnología en el array recibido, normaliza el nombre, construye la URL del icono y verifica si existe.
 * Si el icono existe, devuelve la URL; si no, utiliza una imagen por defecto ('/tech.svg').
 * La función es asíncrona y retorna una promesa que resuelve con el array de resultados.
 */

export const getTechIcon = async (techArray: string[]) => {

  const iconsURL = techArray.map((tech) => {
    const normalized = normalizeTech(tech);

    return {
      tech,
      url: `${techIconBaseURL}/${normalized}/${normalized}-original.svg`
    }
  })
  const results = await Promise.all(iconsURL.map(async ({ url, tech }) => ({
    tech,
    url: (await checkIconExists(url)) ? url : '/tech.svg'
  })))

  return results

}