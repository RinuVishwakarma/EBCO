export interface CareerProp{
    title:string
    description:string
    place:string
    experience:string
    education:string
    tag:string
    id:number
}

const career:CareerProp[] = [
    {
        title:"Asst. Manager – Business Development",
        description:"Effective English communication both written and verbal. Computer conversant. Flair for Industrial Sales. Personal Presentation Skill. Commensurate with profile suitability and ability/skills indicated at the time of interview.",
        place:"Andheri - Mumbai",
        experience:"6-9 years exp in Industrial sales",
        education:"B.E (Mech), DME or Post Graduate Marketing",
        tag:"Engineering",
        id:1
    },
    {
        title:"Asst. Manager – Business Development",
        description:"Effective English communication both written and verbal. Computer conversant. Flair for Industrial Sales. Personal Presentation Skill. Commensurate with profile suitability and ability/skills indicated at the time of interview.",
        place:"Pune",
        experience:"6-9 years exp in Industrial sales",
        education:"B.E (Mech), DME or Post Graduate Marketing",
        tag:"Product",
        id:2

    },
    {
        title:"Asst. Manager – Business Development",
        description:"Effective English communication both written and verbal. Computer conversant. Flair for Industrial Sales. Personal Presentation Skill. Commensurate with profile suitability and ability/skills indicated at the time of interview.",
        place:"hyderabad",
        experience:"6-9 years exp in Industrial sales",
        education:"B.E (Mech), DME or Post Graduate Marketing",
        tag:"Design",
        id:3
    },
    {
        title:"Asst. Manager – Business Development",
        description:"Effective English communication both written and verbal. Computer conversant. Flair for Industrial Sales. Personal Presentation Skill. Commensurate with profile suitability and ability/skills indicated at the time of interview.",
        place:"Chennai",
        experience:"6-9 years exp in Industrial sales",
        education:"B.E (Mech), DME or Post Graduate Marketing",
        tag:"Operation",
        id:4
    }
]

export default career

export const careerTags = ["Engineering", "Product", "Design", "Operation"]