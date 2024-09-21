import type { District } from "./src/types/types";

export const testdistricts: District[] = [
  {
    id: 1,
    name: "North District",
    coordinators: [
      {
        id: 1,
        name: "Alice Johnson",
        district_id: 1,
        telephone_no: "123-456-7890"
      },
      {
        id: 2,
        name: "Bob Smith",
        district_id: 1,
        telephone_no: "098-765-4321"
      }
    ],
    exam_centres: [
      {
        id: 1,
        name: "North High School",
        district_id: 1,
        place: "Downtown",
        gender: "Mixed",
        paper_counts: [
          {
            id: 1, subject: "Maths", medium: "E", count: 150,
      
          },
          {
            id: 2, subject: "Bio", medium: "E", count: 120,
      
          }
        ],
        bus_route: "Route A"
      },
      {
        id: 2,
        name: "North Community Center",
        district_id: 1,
        place: "Uptown",
        gender: "Mixed",
        paper_counts: [
          {
            id: 3, subject: "Physics", medium: "E", count: 100,
      
          },
          {
            id: 4, subject: "Chemistry", medium: "E", count: 80,
      
          }
        ],
        bus_route: "Route B"
      }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "South District",
    coordinators: [
      {
        id: 3,
        name: "Charlie Brown",
        district_id: 2,
        telephone_no: "321-654-9870"
      }
    ],
    exam_centres: [
      {
        id: 3,
        name: "South High School",
        district_id: 2,
        place: "Suburbia",
        gender: "Mixed",
        paper_counts: [
          {
            id: 5, subject: "ICT", medium: "E", count: 200,
      
          },
          {
            id: 6, subject: "Bio", medium: "E", count: 180,
      
          }
        ],
        bus_route: "Route C"
      }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "East District",
    coordinators: [
      {
        id: 4,
        name: "Diana Prince",
        district_id: 3,
        telephone_no: "555-123-4567"
      }
    ],
    exam_centres: [
      {
        id: 4,
        name: "East Technical Institute",
        district_id: 3,
        place: "Industrial Area",
        gender: "Mixed",
        paper_counts: [
          {
            id: 7, subject: "Physics", medium: "E", count: 90,
      
          },
          {
            id: 8, subject: "Chemistry", medium: "E", count: 110,
      
          }
        ],
        bus_route: "Route D"
      }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 4,
    name: "West District",
    coordinators: [
      
    ],
    exam_centres: [
      {
        id: 4,
        name: "West Technical Institute",
        district_id: 4,
        place: "Industrial Area",
        gender: "Mixed",
        paper_counts: [
          {
            id: 7, subject: "Physics", medium: "E", count: 90,
      
          },
          {
            id: 8, subject: "Chemistry", medium: "E", count: 110,
      
          }
        ],
        bus_route: "Route D"
      }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 5,
    name: "North - West District",
    coordinators: [
      {
        id: 4,
        name: "Diana Prince",
        district_id: 3,
        telephone_no: "555-123-4567"
      }
    ],
    exam_centres: [
      // {
      //   id: 4,
      //   name: "North - West Technical Institute",
      //   district_id: 3,
      //   place: "Industrial Area",
      //   gender: "Mixed",
      //   paper_counts: [
      //     {
      //       id: 7, subject: "Physics", medium: "E", count: 90,
      //    
      //     },
      //     {
      //       id: 8, subject: "Chemistry", medium: "E", count: 110,
      //    
      //     }
      //   ],
      //   bus_route: "Route D"
      // }
    ],
    created_at: new Date().toISOString()
  },
  {
    id: 6,
    name: "South - West District",
    coordinators: [
      {
        id: 4,
        name: "Diana Prince",
        district_id: 3,
        telephone_no: "555-123-4567"
      }
    ],
    exam_centres: [
      // {
      //   id: 4,
      //   name: "North - West Technical Institute",
      //   district_id: 3,
      //   place: "Industrial Area",
      //   gender: "Mixed",
      //   paper_counts: [
      //     {
      //       id: 7, subject: "Physics", medium: "E", count: 90,
      //    
      //     },
      //     {
      //       id: 8, subject: "Chemistry", medium: "E", count: 110,
      //    
      //     }
      //   ],
      //   bus_route: "Route D"
      // }
    ],
    created_at: new Date().toISOString()
  }
];
