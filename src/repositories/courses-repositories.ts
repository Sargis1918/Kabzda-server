import { db,Coursetypes } from "../db/db";
export const repositories = {
  courseFinder(id: string) {
    let foundCourse = db.courses.find((p) => p.id === +id);
    return foundCourse;
  },
  courseDeleter(id: string) {
    let deletedCourse;
    const parId = +id;
    for (let i = 0; i < db.courses.length; i++) {
      if (db.courses[i].id === parId) {
        deletedCourse = db.courses.splice(i, 1)[0];
        break;
      }
    }
    return deletedCourse;
  },
  coursePusher(title:string){
    let newCourse:Coursetypes = {
      id: +new Date(),
      title: title,
      studentsCount:11,
   
    };
  db.courses.push(newCourse);
  return newCourse
  },
  courseFinderIndexOf(title:string){
    let foundCourses = db.courses;
        if (title) {
          let searchIndexOf = title;
          foundCourses = foundCourses.filter((p) => p.title.indexOf(searchIndexOf) > -1);
        }
  return foundCourses
      }
};
