import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./user.entity";
import { raw } from "express";
@Injectable()
export class UsersService {

  constructor(@InjectRepository(User)private repo: Repository<User>) {
  }


   create(email:string, password:string){

    /*** If we save data without creating new user hooks are not executed ***/
    const  user = this.repo.create({email, password })
    return  this.repo.save(user)

  }

  async findOne(id:number){
   const  user = await this.repo.findOne({id})
    console.log(user)
    if(!user){
      throw new NotFoundException("user not found!")
    }
   return user
  }
  find(email:string){
    return this.repo.find({email})
  }
 async update(id:number, attrs:Partial<any>){

    /*** if we use update() only one round trip is required, but we can't use hook in this case ㅠㅠㅠㅠ ***/
    const  user =await  this.findOne(id);
   if(!user){
     throw new Error("user not found!");
   }
   Object.assign(user, attrs);
   return this.repo.save(user);

  }
   async remove(id: number){

    /*** remove vs delete ***/
    const  user =await  this.findOne(id);
    if(!user){
       throw new Error("user has already been removed!");
     }

    return this.repo.remove(user)
   }

}
