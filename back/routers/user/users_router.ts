import Router from "express"

const router = Router()

interface IRegisterUser {
  name : string,
  lasname : string
  email : string,
  password? : string,
  gender : string,
  indetification_number : number,
  date_of_birth : Date,
  phone_number : number,
  is_demo : boolean
}

interface ILoginUser {
  cc : number
}

router.post("/register", (req , res) => {
  const body : IRegisterUser = req.body
  console.log(body);
  res.json({
    message: "create user"
  })
})

router.post("/login", async (req, res) => {
  try {
    const { cc }: ILoginUser = req.body;

    const paciente = await db.paciente.findFirst({
      where: {
        cedula: cc
      }
    });

    if (!paciente) {
      return res.status(404).json({
        message: "Usuario no encontrado",
        success: false
      });
    }

    res.json({
      message: "Usuario encontrado",
      success: true,
      data: {
        id: paciente.id,
        cedula: paciente.cedula,
        nombre: paciente.nombre,
        apellido: paciente.apellido,
        email: paciente.email,
        telefono: paciente.telefono,
        genero: paciente.genero,
        demo: paciente.demo
      }
    });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      message: "Error al buscar usuario",
      success: false
    });
  }
})

export default router
