export type Regiao = 'Norte' | 'Centro' | 'Sul' | 'Leste' | 'Luanda'

export interface Provincia {
  id: string
  nome: string
  capital: string
  regiao: Regiao
}

export const provincias: Provincia[] = [
  { id: 'bengo', nome: 'Bengo', capital: 'Caxito', regiao: 'Norte' },
  { id: 'benguela', nome: 'Benguela', capital: 'Benguela', regiao: 'Centro' },
  { id: 'bie', nome: 'Bié', capital: 'Kuito', regiao: 'Centro' },
  { id: 'cabinda', nome: 'Cabinda', capital: 'Cabinda', regiao: 'Norte' },
  { id: 'cuando-cubango', nome: 'Cuando Cubango', capital: 'Menongue', regiao: 'Sul' },
  { id: 'cuanza-norte', nome: 'Cuanza Norte', capital: "N'dalatando", regiao: 'Norte' },
  { id: 'cuanza-sul', nome: 'Cuanza Sul', capital: 'Sumbe', regiao: 'Centro' },
  { id: 'cunene', nome: 'Cunene', capital: 'Ondjiva', regiao: 'Sul' },
  { id: 'huambo', nome: 'Huambo', capital: 'Huambo', regiao: 'Centro' },
  { id: 'huila', nome: 'Huíla', capital: 'Lubango', regiao: 'Sul' },
  { id: 'luanda', nome: 'Luanda', capital: 'Luanda', regiao: 'Luanda' },
  { id: 'lunda-norte', nome: 'Lunda Norte', capital: 'Dundo', regiao: 'Leste' },
  { id: 'lunda-sul', nome: 'Lunda Sul', capital: 'Saurimo', regiao: 'Leste' },
  { id: 'malanje', nome: 'Malanje', capital: 'Malanje', regiao: 'Norte' },
  { id: 'moxico', nome: 'Moxico', capital: 'Luena', regiao: 'Leste' },
  { id: 'namibe', nome: 'Namibe', capital: 'Namibe', regiao: 'Sul' },
  { id: 'uige', nome: 'Uíge', capital: 'Uíge', regiao: 'Norte' },
  { id: 'zaire', nome: 'Zaire', capital: "M'banza Kongo", regiao: 'Norte' },
]
