import bcrypt from 'bcrypt'

const saltRounds = 10

export const hashPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(saltRounds)
  return await bcrypt.hash(password, salt)
}

export const comparePasswords = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash)
}
