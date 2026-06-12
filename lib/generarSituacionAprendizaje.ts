type DatosSituacion = {
  nivel?: string;
  grado?: string;
  unidad?: string;
  tema?: string;
  necesidad?: string;
  eje_transversal?: string;
  estrategias?: string;
  competencias_especificas?: string;
  indicadores?: string;
  contenidos?: any;

  /**
   * Modo recomendado:
   * - "base": genera siempre la misma propuesta para los mismos datos.
   * - "regenerar": genera una variación aleatoria.
   */
  modo?: "base" | "regenerar";
};

const elegirAleatorio = (opciones: string[]) => {
  return opciones[Math.floor(Math.random() * opciones.length)];
};

const crearHash = (texto: string) => {
  let hash = 0;

  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }

  return Math.abs(hash);
};

const elegirDeterministico = (opciones: string[], semilla: string) => {
  if (opciones.length === 0) return "";

  const indice = crearHash(semilla) % opciones.length;

  return opciones[indice];
};

const elegir = (
  opciones: string[],
  semilla: string,
  modo: "base" | "regenerar" = "base"
) => {
  if (modo === "regenerar") {
    return elegirAleatorio(opciones);
  }

  return elegirDeterministico(opciones, semilla);
};

const obtenerContenidoProcedimental = (contenidos: any) => {
  if (!contenidos) return "";

  if (typeof contenidos === "string") {
    try {
      const parsed = JSON.parse(contenidos);
      return parsed.procedimental || contenidos;
    } catch {
      return contenidos;
    }
  }

  return contenidos.procedimental || "";
};

export function generarSituacionAprendizaje(datos: DatosSituacion) {
  const nivel = datos.nivel || "el nivel correspondiente";
  const grado = datos.grado || "el grado correspondiente";
  const unidad = datos.unidad || "la unidad seleccionada";
  const tema = datos.tema || "el contenido trabajado";
  const necesidad = datos.necesidad || "fortalecer la participación activa";
  const eje = datos.eje_transversal || "el eje transversal correspondiente";

  const estrategiaBase =
    datos.estrategias || "estrategias lúdicas, participativas y cooperativas";

  const indicadores =
    datos.indicadores || "los indicadores de logro establecidos";

  const contenido = obtenerContenidoProcedimental(datos.contenidos);

  const modo = datos.modo || "base";

  const semillaBase = `
    ${nivel}
    ${grado}
    ${unidad}
    ${tema}
    ${necesidad}
    ${eje}
    ${estrategiaBase}
    ${indicadores}
    ${contenido}
  `;

  const contextos = [
    `En el contexto del centro educativo, los estudiantes de ${grado} grado del nivel ${nivel} participan en experiencias motrices vinculadas con ${unidad}.`,
    `Durante las clases de Educación Física, el grupo de ${grado} grado del nivel ${nivel} se enfrenta a situaciones prácticas relacionadas con ${unidad}.`,
    `En el espacio escolar destinado a la actividad física, los estudiantes de ${grado} grado exploran experiencias corporales relacionadas con ${tema}.`,
    `A partir de la realidad cotidiana del aula y del patio escolar, el grupo trabaja contenidos vinculados con ${unidad}.`,
    `En un ambiente de participación, juego y movimiento, los estudiantes desarrollan experiencias relacionadas con ${tema}.`,
    `Desde la dinámica diaria del centro educativo, los estudiantes de ${grado} grado se involucran en experiencias de aprendizaje corporal asociadas con ${unidad}.`,
    `En el entorno escolar, el grupo participa en situaciones motrices que les permiten relacionar sus experiencias previas con ${tema}.`,
    `En el marco de las clases de Educación Física, los estudiantes del nivel ${nivel} desarrollan prácticas corporales orientadas al aprendizaje de ${tema}.`,
    `Tomando como punto de partida la vida escolar y las interacciones del grupo, se propone una experiencia vinculada con ${unidad}.`,
    `En el patio, el aula y los espacios disponibles del centro, los estudiantes exploran situaciones relacionadas con ${tema} desde la participación activa.`,
  ];

  const problemas = [
    `Se observa la necesidad de ${necesidad}, promoviendo que los estudiantes movilicen sus saberes previos y participen de forma responsable.`,
    `Surge el reto de aplicar lo aprendido en situaciones motrices significativas que favorezcan la participación, la cooperación y el cuidado del cuerpo.`,
    `La situación plantea el desafío de que los estudiantes reconozcan sus posibilidades de movimiento y las utilicen de manera segura y respetuosa.`,
    `Se identifica la necesidad de fortalecer actitudes positivas durante la práctica corporal, tomando en cuenta el eje transversal ${eje}.`,
    `El grupo necesita responder a un reto motriz que favorezca la integración, la confianza y el respeto por las normas establecidas.`,
    `La realidad del grupo evidencia la importancia de mejorar la participación, la convivencia y el compromiso durante las experiencias corporales.`,
    `Se plantea como desafío que los estudiantes relacionen el contenido trabajado con acciones concretas de cuidado, respeto y colaboración.`,
    `A partir de la experiencia cotidiana del grupo, surge la necesidad de participar en situaciones motrices que promuevan aprendizajes significativos.`,
    `El reto consiste en que los estudiantes utilicen sus habilidades corporales para responder a una necesidad del contexto escolar.`,
    `La situación busca sensibilizar al estudiantado sobre la importancia de actuar con responsabilidad, respeto y disposición durante la actividad física.`,
  ];

  const estrategias = [
    `Para responder a esta situación se utilizará ${estrategiaBase}, favoreciendo la exploración, la participación guiada y el aprendizaje activo.`,
    `El proceso se orientará mediante estrategias de enseñanza-aprendizaje basadas en el juego, la recuperación de experiencias y la participación cooperativa.`,
    `La experiencia se desarrollará mediante una estrategia activa que permita observar, practicar, reflexionar y mejorar el desempeño motriz.`,
    `Se promoverá una dinámica de aprendizaje en la que los estudiantes participen, dialoguen, experimenten y construyan respuestas desde la práctica corporal.`,
    `La intervención pedagógica se organizará a partir de actividades orientadoras, sin sustituir el desarrollo completo establecido en la guía didáctica.`,
    `El proceso pedagógico se apoyará en estrategias participativas que permitan vincular el movimiento, la reflexión y la convivencia.`,
    `Se utilizarán estrategias que favorezcan la exploración corporal, el trabajo colaborativo y la toma de decisiones durante la práctica.`,
    `La enseñanza se organizará mediante experiencias motrices progresivas, respetando el ritmo de aprendizaje y las posibilidades del grupo.`,
    `Se aplicará una estrategia que permita recuperar experiencias previas, orientar la práctica y promover la reflexión sobre lo aprendido.`,
    `La secuencia se orientará desde una metodología activa, lúdica y reflexiva, adecuada al nivel y grado de los estudiantes.`,
  ];

  const productos = [
    `Como producto, los estudiantes evidenciarán sus avances mediante desempeños motrices relacionados con ${tema}.`,
    `La evidencia de aprendizaje será la participación organizada en experiencias corporales que respondan a los indicadores: ${indicadores}.`,
    `El producto esperado será la demostración práctica de habilidades, actitudes y comportamientos vinculados con los contenidos trabajados.`,
    `Los estudiantes producirán respuestas motrices observables que permitan valorar su progreso durante la unidad.`,
    `La evidencia consistirá en la participación activa y responsable en situaciones motrices relacionadas con ${contenido || tema}.`,
    `Como resultado, se espera que los estudiantes demuestren avances en su desempeño corporal y en la aplicación de hábitos y actitudes positivas.`,
    `El producto será un desempeño práctico en el que se evidencie la comprensión del contenido y la participación responsable del estudiante.`,
    `La evidencia se expresará en acciones motrices, actitudes de cooperación y comportamientos observables durante la clase.`,
    `El producto de aprendizaje será la realización de una experiencia motriz en la que se integren los contenidos y los indicadores seleccionados.`,
    `Se valorará como producto la actuación del estudiante en situaciones corporales que muestren progreso, participación y respeto por las normas.`,
  ];

  const puntosLlegada = [
    `Al finalizar, se espera que los estudiantes fortalezcan el respeto, la cooperación, el cuidado de su cuerpo y la confianza en sus posibilidades de movimiento.`,
    `El punto de llegada será que el estudiante actúe con mayor responsabilidad, autonomía y respeto hacia sí mismo, sus compañeros y el entorno.`,
    `Se espera una transformación positiva en su saber ser, expresada en actitudes de colaboración, cuidado, disciplina y participación activa.`,
    `Al concluir la experiencia, los estudiantes deberán mostrar mayor disposición para participar, convivir y aplicar hábitos saludables durante la actividad física.`,
    `El desarrollo esperado apunta a que el estudiante valore la actividad física como medio para mejorar su salud, convivencia y desarrollo personal.`,
    `Se espera que el estudiante fortalezca su identidad corporal, su autoestima y su disposición para participar de manera respetuosa.`,
    `El punto de llegada se orienta hacia la formación de estudiantes más conscientes de su cuerpo, sus emociones y su relación con los demás.`,
    `Al finalizar, se busca que el estudiante manifieste actitudes de responsabilidad, cuidado personal y respeto por la diversidad de capacidades.`,
    `La experiencia debe contribuir a que los estudiantes desarrollen hábitos positivos, sentido de colaboración y compromiso con su bienestar.`,
    `Se espera que el aprendizaje favorezca una mejor convivencia, mayor seguridad motriz y una actitud positiva hacia la actividad física.`,
  ];

  const contexto = elegir(contextos, semillaBase + "contexto", modo);
  const problema = elegir(problemas, semillaBase + "problema", modo);
  const estrategia = elegir(estrategias, semillaBase + "estrategia", modo);
  const producto = elegir(productos, semillaBase + "producto", modo);
  const punto_llegada = elegir(
    puntosLlegada,
    semillaBase + "punto_llegada",
    modo
  );

  return {
    contexto,
    problema,
    estrategia,
    producto,
    punto_llegada,
    situacion_completa: `${contexto} ${problema} ${estrategia} ${producto} ${punto_llegada}`,
  };
}