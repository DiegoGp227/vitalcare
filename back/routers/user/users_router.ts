import Router from "express"

const router = Router()

router.get("/register", (_req , res) => {
  res.json({
    message: "register route"
  })
})

router.get("/login" , (_req , res) => {
  res.json({
    message: "login route"
  })
})

router.get("/user" , (_req , res) => {
  res.json({
    message: "user route"
  })
})

export default router
