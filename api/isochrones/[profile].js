export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Solo POST permitido" });
  }

  const { profile } = req.query; // p.ej. foot-walking, cycling-regular
  const orsUrl = `https://api.openrouteservice.org/v2/isochrones/${profile}`;

  try {
    const r = await fetch(orsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": process.env.ORS_API_KEY  // viene de las variables de entorno en Vercel
      },
      body: JSON.stringify(req.body)
    });

    const text = await r.text(); // Para manejar errores que no son JSON
    res.status(r.status)
       .setHeader("Content-Type", "application/json")
       .send(text);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error en el proxy ORS" });
  }
}
