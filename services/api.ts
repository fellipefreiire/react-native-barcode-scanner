const data = [
  {
    name: 'Kent Mint',
    price: 'R$9,90',
    code: '78943025',
    image: 'https://instadelivery-public.nyc3.digitaloceanspaces.com/itens/163915240361b37b135a994_75_75.jpeg'
  }
]

export interface IProduct {
  name: string
  price: string
  code: string
  image: string
}

export function findProductByCode(code: string) {
  return data.find((product) => product.code === code)
}