"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import AdminSidebar from "@/components/AdminSidebar";

type Tema = {
  tema: string;
  secuencias: string[];
};

export default function NuevaUnidadPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    nivel: "",
    grado: "",
    titulo: "",
    grupos_competencias: "",
    competencias_especificas: "",
    eje_transversal: "",
    areas_articuladas: "",
    estrategias: "",
    contenidos_conceptuales: "",
    contenidos_procedimentales: "",
    contenidos_actitudinales: "",
    indicadores_logro: "",
  });

  const [temas, setTemas] = useState<Tema[]>([
    {
      tema: "",
      secuencias: [""],
    },
  ]);

  const inputStyle =
    "border border-gray-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const textareaStyle =
    "border border-gray-300 p-3 rounded-lg w-full min-h-[90px] focus:outline-none focus:ring-2 focus:ring-[#003B7A]";

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const agregarTema = () => {
    setTemas([
      ...temas,
      {
        tema: "",
        secuencias: [""],
      },
    ]);
  };

  const eliminarTema = (index:number) => {
    if(temas.length===1) return;

    setTemas(
      temas.filter((_,i)=>i!==index)
    );
  };

  const cambiarTema=(index:number,valor:string)=>{

    const copia=[...temas];

    copia[index].tema=valor;

    setTemas(copia);

  }

  const agregarSecuencia=(temaIndex:number)=>{

    const copia=[...temas];

    copia[temaIndex].secuencias.push("");

    setTemas(copia);

  }

const cambiarSecuencia=(
temaIndex:number,
secuenciaIndex:number,
valor:string
)=>{

const copia=[...temas];

copia[temaIndex]
.secuencias[secuenciaIndex]=valor;

setTemas(copia)

}

const eliminarSecuencia=(
temaIndex:number,
secuenciaIndex:number
)=>{

const copia=[...temas];

if(
copia[temaIndex]
.secuencias.length===1
)return;

copia[temaIndex]
.secuencias.splice(
secuenciaIndex,
1
);

setTemas(copia)

}

const guardarUnidad=async(
e:any
)=>{

e.preventDefault();

setLoading(true);

const temasLimpios=
temas
.map((t)=>({

tema:t.tema,

secuencias:
t.secuencias.filter(
(Boolean)
)

}))

.filter(
(t)=>t.tema
);

const {error}=await
supabase
.from("unidades")
.insert([{

...form,

temas:temasLimpios

}])

setLoading(false)

if(error){

alert(error.message)

return;

}

alert(
"Unidad creada"
)

router.push(
"/admin/unidades"
)

}

return(

<div
className="
min-h-screen
bg-[#F5F7FA]
flex"
>

<AdminSidebar/>

<section
className="
ml-[170px]
flex-1
p-10"
>

<div className="
max-w-6xl
mx-auto
bg-white
rounded-2xl
shadow
p-8"
>

<Link
href="/admin/unidades"
className="
inline-block
mb-6
bg-gray-200
hover:bg-gray-300
px-4
py-2
rounded-lg
font-semibold"
>

← Volver

</Link>

<h1
className="
text-3xl
font-bold
text-[#003B7A]
mb-2"
>

Nueva Unidad Curricular

</h1>

<p
className="
text-gray-600
mb-8"
>

Registrar temas y secuencias resumidas.
La plataforma orienta la planificación,
pero el docente debe consultar la guía
didáctica para el desarrollo completo.

</p>

<form
onSubmit={guardarUnidad}
className="
space-y-8"
>

<div
className="
grid
md:grid-cols-3
gap-5"
>

<select
name="nivel"
value={form.nivel}
onChange={handleChange}
className={inputStyle}
required
>

<option value="">
Seleccionar nivel
</option>

<option value="Primario">
Primario
</option>

<option value="Secundario">
Secundario
</option>

</select>

<select
name="grado"
value={form.grado}
onChange={handleChange}
className={inputStyle}
required
>

<option value="">
Seleccionar grado
</option>

<option value="1">1ro.</option>
<option value="2">2do.</option>
<option value="3">3ro.</option>
<option value="4">4to.</option>
<option value="5">5to.</option>
<option value="6">6to.</option>

</select>

<input
name="titulo"
placeholder="Nombre unidad"
value={form.titulo}
onChange={handleChange}
className={inputStyle}
/>

</div>

<div className="border rounded-xl">

<div
className="
bg-[#003B7A]
text-white
font-bold
text-center
py-3"
>

Temas y secuencias resumidas

</div>

<div className="p-5">

{temas.map((tema,i)=>(

<div
key={i}
className="
border
rounded-xl
p-5
mb-5
bg-gray-50"
>

<div
className="
flex
justify-between
mb-4"
>

<h2
className="
font-bold
text-[#003B7A]"
>

Tema {i+1}

</h2>

<button
type="button"
onClick={()=>eliminarTema(i)}
className="
bg-red-600
text-white
px-4
rounded-lg"
>

Eliminar

</button>

</div>

<input
value={tema.tema}
onChange={(e)=>
cambiarTema(
i,
e.target.value
)
}
placeholder="
Explorando el concepto"
className={inputStyle}
/>

<div className="mt-5 space-y-3">

{tema.secuencias.map(
(secuencia,j)=>(

<div
key={j}
className="
flex
gap-3"
>

<textarea
value={secuencia}
onChange={(e)=>
cambiarSecuencia(
i,
j,
e.target.value
)
}
placeholder="
Cuento sobre aventura..."
className={textareaStyle}
/>

<button
type="button"
onClick={()=>
eliminarSecuencia(
i,j
)
}
className="
bg-red-500
text-white
px-4
rounded-lg"
>

X

</button>

</div>

)

)}

</div>

<button
type="button"
onClick={()=>
agregarSecuencia(i)
}
className="
mt-4
bg-green-600
text-white
px-4
py-2
rounded-lg"
>

+ agregar secuencia

</button>

</div>

))}

<button
type="button"
onClick={agregarTema}
className="
bg-[#003B7A]
text-white
px-5
py-3
rounded-lg
font-bold"
>

+ Agregar tema

</button>

</div>

</div>

<div
className="
bg-yellow-50
border
border-yellow-300
rounded-xl
p-4"
>

<strong>
Importante:
</strong>

No copiar el desarrollo
completo de las guías.

Registrar solo temas y
secuencias resumidas.

</div>

<button
disabled={loading}
className="
bg-green-600
hover:bg-green-700
text-white
px-6
py-3
rounded-xl
font-bold"
>

{loading
?"Guardando..."
:"Guardar unidad"}

</button>

</form>

</div>

</section>

</div>

)

}