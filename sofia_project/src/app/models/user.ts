export class User {
  name: string
  lastname: string
  age: string
  email: string
  studentCode: string
  firstQuestion: string
  secondQuestion: string
  thirdQuestion: string
  password: string

  constructor(name: string,
              lastname: string,
              age: string,
              email: string,
              studentCode: string,
              firstQuestion: string,
              secondQuestion: string,
              thirdQuestion: string,
              password: string) {
    this.name = name
    this.lastname = lastname
    this.age = age
    this.email = email
    this.studentCode = studentCode
    this.firstQuestion = firstQuestion
    this.secondQuestion = secondQuestion
    this.thirdQuestion = thirdQuestion
    this.password = password
  }
}

export class Entity {
  nameEntity: string
  imgEntity: string
  stateEntity: string
  entities: any;

  constructor(nameEntity: string,
              imgEntity: string,
              stateEntity: string) {
    this.nameEntity = nameEntity
    this.imgEntity = imgEntity
    this.stateEntity = stateEntity
  }
}
