// Knowledge base for academic topics
export const academicKnowledge = {
    // Computer Science Fundamentals
    computerScience: {
        algorithms: {
            definition: "Algorithms are step-by-step procedures or formulas for solving problems.",
            complexity:
                "Algorithm complexity is measured using Big O notation, which describes the performance or complexity of an algorithm in terms of time and space requirements.",
            sorting: {
                quicksort:
                    "Quicksort is a divide-and-conquer algorithm with average time complexity of O(n log n). It works by selecting a 'pivot' element and partitioning the array around the pivot.",
                mergesort:
                    "Merge sort is a divide-and-conquer algorithm with consistent O(n log n) time complexity. It divides the array into halves, sorts them, and then merges them.",
                bubblesort:
                    "Bubble sort is a simple sorting algorithm with O(n²) time complexity. It repeatedly steps through the list, compares adjacent elements, and swaps them if they're in the wrong order.",
            },
            searching: {
                binary:
                    "Binary search is an efficient O(log n) algorithm for finding an item in a sorted list. It works by repeatedly dividing the search interval in half.",
                linear:
                    "Linear search is a simple O(n) algorithm that checks each element in a list until it finds a match or reaches the end.",
            },
        },
        dataStructures: {
            arrays:
                "Arrays store elements in contiguous memory locations, providing O(1) access time but potentially O(n) insertion/deletion time.",
            linkedLists:
                "Linked lists store elements in nodes that point to the next node, providing O(1) insertion/deletion time but O(n) access time.",
            stacks: "Stacks follow the Last-In-First-Out (LIFO) principle and support push and pop operations.",
            queues: "Queues follow the First-In-First-Out (FIFO) principle and support enqueue and dequeue operations.",
            trees:
                "Trees are hierarchical data structures with a root node and child nodes. Binary trees have at most two children per node.",
            graphs: "Graphs consist of vertices connected by edges, useful for representing networks and relationships.",
            hashTables:
                "Hash tables provide O(1) average-case lookup, insertion, and deletion by mapping keys to array indices using a hash function.",
        },
        programmingConcepts: {
            recursion:
                "Recursion is when a function calls itself to solve smaller instances of the same problem, requiring a base case to prevent infinite recursion.",
            iteration: "Iteration uses loops to repeat a block of code until a condition is met.",
            variables: "Variables are named storage locations that hold values of specific data types.",
            conditionals: "Conditional statements (if-else) allow code to execute different paths based on conditions.",
            functions:
                "Functions are reusable blocks of code that perform specific tasks, accepting inputs and returning outputs.",
        },
    },

    // Operating Systems
    operatingSystems: {
        processes: {
            definition: "A process is an instance of a program in execution, with its own memory space and resources.",
            states: "Process states include: New, Ready, Running, Waiting, and Terminated.",
            scheduling:
                "Process scheduling determines which process runs at a given time, using algorithms like Round Robin, FCFS, and Priority Scheduling.",
        },
        memory: {
            management:
                "Memory management allocates and deallocates memory for processes, handling virtual memory, paging, and segmentation.",
            virtualMemory:
                "Virtual memory uses disk space to extend RAM, allowing programs to use more memory than physically available.",
            paging:
                "Paging divides memory into fixed-size blocks called pages, helping with memory allocation and fragmentation.",
        },
        fileSystem: {
            structure: "File systems organize data on storage devices, managing files, directories, and access permissions.",
            operations: "File operations include create, read, write, delete, and seek.",
            types: "Common file systems include FAT32, NTFS, ext4, and HFS+.",
        },
        concurrency: {
            threads:
                "Threads are lightweight processes that share the same memory space, enabling parallel execution within a process.",
            synchronization:
                "Synchronization mechanisms like mutexes, semaphores, and monitors prevent race conditions in concurrent systems.",
            deadlocks:
                "Deadlocks occur when processes are waiting for resources held by each other, creating a circular wait condition.",
        },
    },

    // Computer Networks
    computerNetworks: {
        models: {
            osi: "The OSI model has 7 layers: Physical, Data Link, Network, Transport, Session, Presentation, and Application.",
            tcpip: "The TCP/IP model has 4 layers: Network Interface, Internet, Transport, and Application.",
        },
        protocols: {
            tcp: "TCP (Transmission Control Protocol) is connection-oriented, reliable, and ensures ordered delivery of data.",
            udp: "UDP (User Datagram Protocol) is connectionless, unreliable, but faster than TCP for applications that can tolerate packet loss.",
            http: "HTTP (Hypertext Transfer Protocol) is used for web browsing, operating on port 80.",
            https: "HTTPS is the secure version of HTTP, using encryption (SSL/TLS) and operating on port 443.",
            dns: "DNS (Domain Name System) translates domain names to IP addresses.",
        },
        networking: {
            ipAddressing: "IP addresses uniquely identify devices on a network. IPv4 uses 32 bits, while IPv6 uses 128 bits.",
            subnetting: "Subnetting divides a network into smaller, more manageable sub-networks.",
            routing: "Routing is the process of selecting paths for sending data across networks.",
            switching: "Switching connects devices within the same network, operating at the data link layer.",
        },
        security: {
            firewall: "Firewalls monitor and filter network traffic based on security rules.",
            encryption: "Encryption converts data into a code to prevent unauthorized access.",
            vpn: "VPNs (Virtual Private Networks) create secure connections over public networks.",
        },
    },

    // Object-Oriented Programming
    oop: {
        concepts: {
            classes: "Classes are blueprints for creating objects, defining their properties and behaviors.",
            objects: "Objects are instances of classes with specific property values.",
            inheritance: "Inheritance allows a class to inherit properties and methods from another class.",
            polymorphism: "Polymorphism allows objects of different classes to be treated as objects of a common superclass.",
            encapsulation:
                "Encapsulation hides the internal state of objects and requires interaction through well-defined interfaces.",
            abstraction:
                "Abstraction simplifies complex systems by modeling classes based on essential properties and behaviors.",
        },
        principles: {
            solid: {
                singleResponsibility: "Single Responsibility Principle: A class should have only one reason to change.",
                openClosed:
                    "Open/Closed Principle: Software entities should be open for extension but closed for modification.",
                liskovSubstitution:
                    "Liskov Substitution Principle: Objects of a superclass should be replaceable with objects of subclasses without affecting program correctness.",
                interfaceSegregation:
                    "Interface Segregation Principle: Many client-specific interfaces are better than one general-purpose interface.",
                dependencyInversion:
                    "Dependency Inversion Principle: High-level modules should not depend on low-level modules; both should depend on abstractions.",
            },
        },
        patterns: {
            singleton: "Singleton pattern ensures a class has only one instance and provides a global point of access to it.",
            factory: "Factory pattern creates objects without specifying the exact class to create.",
            observer:
                "Observer pattern defines a one-to-many dependency between objects, so when one object changes state, all dependents are notified.",
            strategy:
                "Strategy pattern defines a family of algorithms, encapsulates each one, and makes them interchangeable.",
        },
    },

    // Database Systems
    databaseSystems: {
        concepts: {
            dbms: "A Database Management System (DBMS) is software for creating and managing databases.",
            schema: "A database schema defines the structure and organization of data in a database.",
            normalization:
                "Normalization reduces data redundancy and improves data integrity through a series of normal forms.",
            transaction: "A transaction is a sequence of operations performed as a single logical unit of work.",
        },
        types: {
            relational: "Relational databases store data in tables with rows and columns, using SQL for queries.",
            nosql:
                "NoSQL databases provide flexible schemas for unstructured data, including document, key-value, column-family, and graph databases.",
            distributed: "Distributed databases spread data across multiple physical locations.",
            inmemory: "In-memory databases store data primarily in RAM for faster access.",
        },
        sql: {
            queries: "SQL queries retrieve and manipulate data using SELECT, INSERT, UPDATE, and DELETE statements.",
            joins: "SQL joins combine rows from two or more tables based on related columns.",
            indexes: "Indexes improve query performance by providing faster access to data.",
            constraints:
                "Constraints enforce rules on data columns, including PRIMARY KEY, FOREIGN KEY, UNIQUE, and CHECK constraints.",
        },
    },

    // AI/ML
    aiml: {
        concepts: {
            ai: "Artificial Intelligence is the simulation of human intelligence in machines.",
            ml: "Machine Learning is a subset of AI where systems learn from data without explicit programming.",
            dl: "Deep Learning uses neural networks with multiple layers to learn from data.",
            nlp: "Natural Language Processing enables computers to understand and generate human language.",
        },
        algorithms: {
            supervised: {
                regression: "Regression predicts continuous values based on input features.",
                classification: "Classification assigns categories to input data.",
                examples:
                    "Examples include Linear Regression, Logistic Regression, Decision Trees, and Support Vector Machines.",
            },
            unsupervised: {
                clustering: "Clustering groups similar data points without predefined categories.",
                dimensionality:
                    "Dimensionality reduction techniques reduce the number of features while preserving important information.",
                examples: "Examples include K-means, Hierarchical Clustering, PCA, and t-SNE.",
            },
            reinforcement:
                "Reinforcement Learning trains agents to make sequences of decisions by rewarding desired behaviors.",
        },
        evaluation: {
            metrics: "Evaluation metrics include accuracy, precision, recall, F1-score, and ROC curves.",
            validation: "Cross-validation assesses how models generalize to independent datasets.",
            overfitting: "Overfitting occurs when models perform well on training data but poorly on new data.",
        },
    },

    // Mathematics
    mathematics: {
        calculus: {
            limits: "Limits describe the behavior of a function as its input approaches a certain value.",
            derivatives: "Derivatives measure the rate of change of a function with respect to its variables.",
            integrals: "Integrals calculate the area under a curve or the accumulation of quantities.",
            applications: "Applications include optimization, related rates, and area/volume calculations.",
        },
        linearAlgebra: {
            vectors: "Vectors represent quantities with both magnitude and direction.",
            matrices: "Matrices are rectangular arrays of numbers used for linear transformations.",
            eigenvalues:
                "Eigenvalues and eigenvectors are special values and vectors associated with linear transformations.",
            applications: "Applications include computer graphics, data analysis, and solving systems of equations.",
        },
        discreteMath: {
            logic: "Logic deals with formal reasoning using statements that are true or false.",
            setTheory: "Set theory studies collections of objects and operations on them.",
            combinatorics: "Combinatorics studies counting, arrangement, and combination of objects.",
            graphTheory: "Graph theory studies relationships between objects using vertices and edges.",
        },
        probability: {
            basics: "Probability measures the likelihood of events occurring.",
            distributions: "Probability distributions describe the likelihood of all possible outcomes.",
            conditionalProbability:
                "Conditional probability is the probability of an event given that another event has occurred.",
            applications: "Applications include statistics, machine learning, and decision-making under uncertainty.",
        },
    },
}

// Student-specific information (in a real app, this would come from a database)
export interface Assignment {
    title: string
    dueDate: string
    status: "Pending" | "Completed" | "Not started"
    description: string
}

export interface Course {
    code: string
    name: string
    instructor: string
    grade: string
    attendance: string
    assignments: Assignment[]
}

export interface StudentInfo {
    name: string
    id: string
    gpa: number
    courses: Course[]
    academicStanding: string
    advisorName: string
    advisorEmail: string
}

export const studentInfo: StudentInfo = {
    name: "John Doe",
    id: "S12345",
    gpa: 3.8,
    courses: [
        {
            code: "CS101",
            name: "Computer Science Fundamentals",
            instructor: "Prof. Smith",
            grade: "A",
            attendance: "85%",
            assignments: [
                {
                    title: "Algorithm Analysis Report",
                    dueDate: "Tomorrow, 11:59 PM",
                    status: "Pending",
                    description: "Analyze the time and space complexity of algorithms discussed in class.",
                },
                {
                    title: "Data Structures Implementation",
                    dueDate: "Next week, Friday",
                    status: "Not started",
                    description: "Implement a binary search tree with insertion, deletion, and traversal operations.",
                },
            ],
        },
        {
            code: "MATH202",
            name: "Mathematics for Computer Science",
            instructor: "Prof. Johnson",
            grade: "B+",
            attendance: "92%",
            assignments: [
                {
                    title: "Calculus Problem Set",
                    dueDate: "3 days, 11:59 PM",
                    status: "Pending",
                    description: "Complete problems 1-15 from Chapter 4 of the textbook.",
                },
            ],
        },
        {
            code: "PHYS101",
            name: "Physics I",
            instructor: "Prof. Williams",
            grade: "B",
            attendance: "78%",
            assignments: [
                {
                    title: "Lab Report: Motion Analysis",
                    dueDate: "Next Monday",
                    status: "Not started",
                    description: "Analyze the data collected during the pendulum experiment.",
                },
            ],
        },
    ],
    academicStanding: "Good",
    advisorName: "Dr. Anderson",
    advisorEmail: "anderson@educonnect.edu",
}

// Function to get course by code or name
export function getCourse(query: string): Course | undefined {
    query = query.toLowerCase()
    return studentInfo.courses.find(
        (course) => course.code.toLowerCase() === query || course.name.toLowerCase().includes(query),
    )
}

// Function to get assignments for a course
export function getAssignments(courseQuery: string): Assignment[] | null {
    const course = getCourse(courseQuery)
    return course ? course.assignments : null
}

// Function to get next due assignment
export interface NextDueAssignment extends Assignment {
    course: string
}

export function getNextDueAssignment(): NextDueAssignment | null {
    let nextAssignment: NextDueAssignment | null = null
    let earliestDate = new Date(9999, 11, 31) // Far future date

    studentInfo.courses.forEach((course) => {
        course.assignments.forEach((assignment) => {
            if (assignment.status === "Pending") {
                // Simple parsing for demo purposes
                const dueDate = parseDueDate(assignment.dueDate)
                if (dueDate < earliestDate) {
                    earliestDate = dueDate
                    nextAssignment = {
                        ...assignment,
                        course: course.code,
                    }
                }
            }
        })
    })

    return nextAssignment
}

// Helper function to parse due date strings
export function parseDueDate(dueDateStr: string): Date {
    const now = new Date()
    if (dueDateStr.includes("Tomorrow")) {
        return new Date(now.getTime() + 24 * 60 * 60 * 1000)
    } else if (dueDateStr.includes("days")) {
        const days = Number.parseInt(dueDateStr.split(" ")[0])
        return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
    } else if (dueDateStr.includes("week")) {
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    } else {
        return new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // Default to 2 weeks
    }
}

// Function to get grade improvement suggestions
export function getGradeImprovementSuggestions(): string[] {
    return [
        "Attend all classes and participate actively",
        "Form or join study groups for collaborative learning",
        "Complete all assignments on time and thoroughly",
        "Visit your professor during office hours for clarification",
        "Review material regularly instead of cramming before exams",
        "Practice with past exams and additional problems",
        "Take advantage of tutoring services and academic resources",
        "Maintain a balanced schedule with adequate sleep and breaks",
    ]
}

// Main response function
export function getBotResponse(input: string): string {
    const lowerInput = input.toLowerCase()

    // Check for greetings
    if (lowerInput.match(/\b(hi|hello|hey|greetings)\b/)) {
        return `Hello ${studentInfo.name}! How can I help you with your studies today?`
    }

    // Check for assignment-related queries
    if (lowerInput.includes("assignment") || lowerInput.includes("homework") || lowerInput.includes("project")) {
        // Check if asking about a specific course
        for (const course of studentInfo.courses) {
            if (lowerInput.includes(course.code.toLowerCase()) || lowerInput.includes(course.name.toLowerCase())) {
                const assignments = getAssignments(course.code)
                if (assignments && assignments.length > 0) {
                    let response = `For ${course.code} (${course.name}), you have the following assignments:\n\n`
                    assignments.forEach((assignment) => {
                        response += `• ${assignment.title} - Due: ${assignment.dueDate}\n  Status: ${assignment.status}\n  ${assignment.description}\n\n`
                    })
                    return response
                } else {
                    return `You don't have any pending assignments for ${course.code} at the moment.`
                }
            }
        }

        // General assignment query
        const nextAssignment = getNextDueAssignment()
        if (nextAssignment) {
            return `Your next assignment is the ${nextAssignment.title} for ${nextAssignment.course}, due ${nextAssignment.dueDate}.\n\nDescription: ${nextAssignment.description}\n\nWould you like me to help you prepare for it?`
        } else {
            return "You don't have any pending assignments at the moment. Great job staying on top of your work!"
        }
    }

    // Check for course-related queries
    if (lowerInput.includes("course") || lowerInput.includes("class") || lowerInput.includes("subject")) {
        // Check if asking about a specific course
        for (const course of studentInfo.courses) {
            if (lowerInput.includes(course.code.toLowerCase()) || lowerInput.includes(course.name.toLowerCase())) {
                return `${course.code}: ${course.name}\nInstructor: ${course.instructor}\nCurrent Grade: ${course.grade}\nAttendance: ${course.attendance}\n\nYou have ${course.assignments.length} assignment(s) for this course.`
            }
        }

        // General course query
        let response = "You're currently enrolled in the following courses:\n\n"
        studentInfo.courses.forEach((course) => {
            response += `• ${course.code}: ${course.name}\n  Instructor: ${course.instructor}\n  Current Grade: ${course.grade}\n\n`
        })
        return response
    }

    // Check for GPA or grade-related queries
    if (lowerInput.includes("gpa") || lowerInput.includes("grade") || lowerInput.includes("marks")) {
        if (lowerInput.includes("improve") || lowerInput.includes("better") || lowerInput.includes("increase")) {
            const suggestions = getGradeImprovementSuggestions()
            let response = "Here are some strategies to improve your grades:\n\n"
            suggestions.forEach((suggestion, index) => {
                response += `${index + 1}. ${suggestion}\n`
            })
            return response
        }

        return `Your current GPA is ${studentInfo.gpa}. Your academic standing is "${studentInfo.academicStanding}".`
    }

    // Check for attendance-related queries
    if (lowerInput.includes("attendance") || lowerInput.includes("absent") || lowerInput.includes("present")) {
        // Check if asking about a specific course
        for (const course of studentInfo.courses) {
            if (lowerInput.includes(course.code.toLowerCase()) || lowerInput.includes(course.name.toLowerCase())) {
                return `Your attendance for ${course.code} is ${course.attendance}.`
            }
        }

        // General attendance query
        let response = "Here's your attendance record:\n\n"
        studentInfo.courses.forEach((course) => {
            response += `• ${course.code}: ${course.attendance}\n`
        })
        return response
    }

    // Check for academic concepts
    // Computer Science
    if (lowerInput.includes("algorithm") || lowerInput.includes("sort") || lowerInput.includes("search")) {
        if (lowerInput.includes("quicksort")) {
            return academicKnowledge.computerScience.algorithms.sorting.quicksort
        } else if (lowerInput.includes("mergesort")) {
            return academicKnowledge.computerScience.algorithms.sorting.mergesort
        } else if (lowerInput.includes("bubblesort")) {
            return academicKnowledge.computerScience.algorithms.sorting.bubblesort
        } else if (lowerInput.includes("binary search")) {
            return academicKnowledge.computerScience.algorithms.searching.binary
        } else if (lowerInput.includes("linear search")) {
            return academicKnowledge.computerScience.algorithms.searching.linear
        } else if (lowerInput.includes("complexity") || lowerInput.includes("big o")) {
            return academicKnowledge.computerScience.algorithms.complexity
        } else {
            return academicKnowledge.computerScience.algorithms.definition
        }
    }

    if (lowerInput.includes("data structure")) {
        if (lowerInput.includes("array")) {
            return academicKnowledge.computerScience.dataStructures.arrays
        } else if (lowerInput.includes("linked list")) {
            return academicKnowledge.computerScience.dataStructures.linkedLists
        } else if (lowerInput.includes("stack")) {
            return academicKnowledge.computerScience.dataStructures.stacks
        } else if (lowerInput.includes("queue")) {
            return academicKnowledge.computerScience.dataStructures.queues
        } else if (lowerInput.includes("tree")) {
            return academicKnowledge.computerScience.dataStructures.trees
        } else if (lowerInput.includes("graph")) {
            return academicKnowledge.computerScience.dataStructures.graphs
        } else if (lowerInput.includes("hash") || lowerInput.includes("map")) {
            return academicKnowledge.computerScience.dataStructures.hashTables
        } else {
            return "Data structures are ways to organize and store data for efficient access and modification. Common data structures include arrays, linked lists, stacks, queues, trees, graphs, and hash tables. Which one would you like to learn about?"
        }
    }

    // Operating Systems
    if (lowerInput.includes("operating system")) {
        if (lowerInput.includes("process")) {
            if (lowerInput.includes("state")) {
                return academicKnowledge.operatingSystems.processes.states
            } else if (lowerInput.includes("schedul")) {
                return academicKnowledge.operatingSystems.processes.scheduling
            } else {
                return academicKnowledge.operatingSystems.processes.definition
            }
        } else if (lowerInput.includes("memory")) {
            if (lowerInput.includes("virtual")) {
                return academicKnowledge.operatingSystems.memory.virtualMemory
            } else if (lowerInput.includes("paging")) {
                return academicKnowledge.operatingSystems.memory.paging
            } else {
                return academicKnowledge.operatingSystems.memory.management
            }
        } else if (lowerInput.includes("file system")) {
            return academicKnowledge.operatingSystems.fileSystem.structure
        } else if (lowerInput.includes("thread")) {
            return academicKnowledge.operatingSystems.concurrency.threads
        } else if (lowerInput.includes("deadlock")) {
            return academicKnowledge.operatingSystems.concurrency.deadlocks
        } else {
            return "Operating systems are software that manage computer hardware and software resources and provide common services for computer programs. Key concepts include processes, memory management, file systems, and concurrency. What specific OS topic would you like to learn about?"
        }
    }

    // Computer Networks
    if (lowerInput.includes("network") || lowerInput.includes("protocol")) {
        if (lowerInput.includes("osi")) {
            return academicKnowledge.computerNetworks.models.osi
        } else if (lowerInput.includes("tcp/ip") || lowerInput.includes("tcp ip")) {
            return academicKnowledge.computerNetworks.models.tcpip
        } else if (lowerInput.includes("tcp")) {
            return academicKnowledge.computerNetworks.protocols.tcp
        } else if (lowerInput.includes("udp")) {
            return academicKnowledge.computerNetworks.protocols.udp
        } else if (lowerInput.includes("http")) {
            if (lowerInput.includes("https")) {
                return academicKnowledge.computerNetworks.protocols.https
            } else {
                return academicKnowledge.computerNetworks.protocols.http
            }
        } else if (lowerInput.includes("dns")) {
            return academicKnowledge.computerNetworks.protocols.dns
        } else if (lowerInput.includes("ip") || lowerInput.includes("address")) {
            return academicKnowledge.computerNetworks.networking.ipAddressing
        } else if (lowerInput.includes("subnet")) {
            return academicKnowledge.computerNetworks.networking.subnetting
        } else if (lowerInput.includes("rout")) {
            return academicKnowledge.computerNetworks.networking.routing
        } else if (lowerInput.includes("switch")) {
            return academicKnowledge.computerNetworks.networking.switching
        } else {
            return "Computer networks allow computers to communicate and share resources. Key concepts include network models (OSI, TCP/IP), protocols (TCP, UDP, HTTP), IP addressing, routing, and network security. What specific networking topic would you like to learn about?"
        }
    }

    // Object-Oriented Programming
    if (lowerInput.includes("oop") || lowerInput.includes("object oriented") || lowerInput.includes("object-oriented")) {
        if (lowerInput.includes("class")) {
            return academicKnowledge.oop.concepts.classes
        } else if (lowerInput.includes("object")) {
            return academicKnowledge.oop.concepts.objects
        } else if (lowerInput.includes("inherit")) {
            return academicKnowledge.oop.concepts.inheritance
        } else if (lowerInput.includes("polymorph")) {
            return academicKnowledge.oop.concepts.polymorphism
        } else if (lowerInput.includes("encapsulat")) {
            return academicKnowledge.oop.concepts.encapsulation
        } else if (lowerInput.includes("abstract")) {
            return academicKnowledge.oop.concepts.abstraction
        } else if (lowerInput.includes("solid")) {
            return "SOLID principles are five design principles for writing maintainable and scalable software: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion. Which principle would you like to learn about?"
        } else if (lowerInput.includes("pattern")) {
            if (lowerInput.includes("singleton")) {
                return academicKnowledge.oop.patterns.singleton
            } else if (lowerInput.includes("factory")) {
                return academicKnowledge.oop.patterns.factory
            } else if (lowerInput.includes("observer")) {
                return academicKnowledge.oop.patterns.observer
            } else if (lowerInput.includes("strategy")) {
                return academicKnowledge.oop.patterns.strategy
            } else {
                return "Design patterns are reusable solutions to common problems in software design. Common patterns include Singleton, Factory, Observer, and Strategy patterns. Which pattern would you like to learn about?"
            }
        } else {
            return "Object-Oriented Programming (OOP) is a programming paradigm based on the concept of 'objects' containing data and methods. Key concepts include classes, objects, inheritance, polymorphism, encapsulation, and abstraction. What specific OOP concept would you like to learn about?"
        }
    }

    // Database Systems
    if (lowerInput.includes("database") || lowerInput.includes("sql") || lowerInput.includes("db")) {
        if (lowerInput.includes("dbms")) {
            return academicKnowledge.databaseSystems.concepts.dbms
        } else if (lowerInput.includes("schema")) {
            return academicKnowledge.databaseSystems.concepts.schema
        } else if (lowerInput.includes("normal") || lowerInput.includes("normalization")) {
            return academicKnowledge.databaseSystems.concepts.normalization
        } else if (lowerInput.includes("transaction")) {
            return academicKnowledge.databaseSystems.concepts.transaction
        } else if (lowerInput.includes("relational")) {
            return academicKnowledge.databaseSystems.types.relational
        } else if (lowerInput.includes("nosql")) {
            return academicKnowledge.databaseSystems.types.nosql
        } else if (lowerInput.includes("sql")) {
            if (lowerInput.includes("join")) {
                return academicKnowledge.databaseSystems.sql.joins
            } else if (lowerInput.includes("index")) {
                return academicKnowledge.databaseSystems.sql.indexes
            } else if (lowerInput.includes("constraint")) {
                return academicKnowledge.databaseSystems.sql.constraints
            } else {
                return academicKnowledge.databaseSystems.sql.queries
            }
        } else {
            return "Database systems store, retrieve, and manage data. Key concepts include DBMS, schemas, normalization, transactions, and different database types (relational, NoSQL). What specific database topic would you like to learn about?"
        }
    }

    // AI/ML
    if (
        lowerInput.includes("ai") ||
        lowerInput.includes("artificial intelligence") ||
        lowerInput.includes("machine learning") ||
        lowerInput.includes("ml") ||
        lowerInput.includes("deep learning")
    ) {
        if (lowerInput.includes("machine learning") || lowerInput.includes("ml")) {
            return academicKnowledge.aiml.concepts.ml
        } else if (lowerInput.includes("deep learning") || lowerInput.includes("dl")) {
            return academicKnowledge.aiml.concepts.dl
        } else if (lowerInput.includes("nlp") || lowerInput.includes("natural language")) {
            return academicKnowledge.aiml.concepts.nlp
        } else if (lowerInput.includes("supervised")) {
            if (lowerInput.includes("regression")) {
                return academicKnowledge.aiml.algorithms.supervised.regression
            } else if (lowerInput.includes("classification")) {
                return academicKnowledge.aiml.algorithms.supervised.classification
            } else {
                return "Supervised learning algorithms learn from labeled training data to make predictions. Examples include regression (for continuous values) and classification (for categories). Would you like to know more about specific supervised learning algorithms?"
            }
        } else if (lowerInput.includes("unsupervised")) {
            if (lowerInput.includes("clustering")) {
                return academicKnowledge.aiml.algorithms.unsupervised.clustering
            } else if (lowerInput.includes("dimension")) {
                return academicKnowledge.aiml.algorithms.unsupervised.dimensionality
            } else {
                return "Unsupervised learning algorithms find patterns in unlabeled data. Examples include clustering (grouping similar data) and dimensionality reduction. Would you like to know more about specific unsupervised learning algorithms?"
            }
        } else if (lowerInput.includes("reinforcement")) {
            return academicKnowledge.aiml.algorithms.reinforcement
        } else if (lowerInput.includes("overfit")) {
            return academicKnowledge.aiml.evaluation.overfitting
        } else if (
            lowerInput.includes("metric") ||
            lowerInput.includes("accuracy") ||
            lowerInput.includes("precision") ||
            lowerInput.includes("recall")
        ) {
            return academicKnowledge.aiml.evaluation.metrics
        } else {
            return "Artificial Intelligence (AI) is the simulation of human intelligence in machines. Machine Learning is a subset of AI where systems learn from data. Key concepts include supervised learning, unsupervised learning, reinforcement learning, and deep learning. What specific AI/ML topic would you like to learn about?"
        }
    }

    // Mathematics
    if (
        lowerInput.includes("math") ||
        lowerInput.includes("calculus") ||
        lowerInput.includes("algebra") ||
        lowerInput.includes("probability")
    ) {
        if (lowerInput.includes("calculus")) {
            if (lowerInput.includes("limit")) {
                return academicKnowledge.mathematics.calculus.limits
            } else if (lowerInput.includes("derivative")) {
                return academicKnowledge.mathematics.calculus.derivatives
            } else if (lowerInput.includes("integral")) {
                return academicKnowledge.mathematics.calculus.integrals
            } else {
                return "Calculus is the mathematical study of continuous change. Key concepts include limits, derivatives (rates of change), and integrals (accumulation). What specific calculus topic would you like to learn about?"
            }
        } else if (
            lowerInput.includes("linear algebra") ||
            (lowerInput.includes("linear") && lowerInput.includes("algebra"))
        ) {
            if (lowerInput.includes("vector")) {
                return academicKnowledge.mathematics.linearAlgebra.vectors
            } else if (lowerInput.includes("matrix") || lowerInput.includes("matrices")) {
                return academicKnowledge.mathematics.linearAlgebra.matrices
            } else if (lowerInput.includes("eigen")) {
                return academicKnowledge.mathematics.linearAlgebra.eigenvalues
            } else {
                return "Linear algebra is the branch of mathematics concerning linear equations, vectors, and matrices. Key concepts include vectors, matrices, and eigenvalues/eigenvectors. What specific linear algebra topic would you like to learn about?"
            }
        } else if (lowerInput.includes("discrete")) {
            if (lowerInput.includes("logic")) {
                return academicKnowledge.mathematics.discreteMath.logic
            } else if (lowerInput.includes("set")) {
                return academicKnowledge.mathematics.discreteMath.setTheory
            } else if (lowerInput.includes("combinatorics") || lowerInput.includes("counting")) {
                return academicKnowledge.mathematics.discreteMath.combinatorics
            } else if (lowerInput.includes("graph")) {
                return academicKnowledge.mathematics.discreteMath.graphTheory
            } else {
                return "Discrete mathematics studies mathematical structures that are fundamentally discrete (not continuous). Topics include logic, set theory, combinatorics, and graph theory. What specific discrete math topic would you like to learn about?"
            }
        } else if (lowerInput.includes("probability")) {
            if (lowerInput.includes("distribution")) {
                return academicKnowledge.mathematics.probability.distributions
            } else if (lowerInput.includes("conditional")) {
                return academicKnowledge.mathematics.probability.conditionalProbability
            } else {
                return academicKnowledge.mathematics.probability.basics
            }
        } else {
            return "Mathematics includes various branches such as calculus, linear algebra, discrete mathematics, and probability. Each branch has its own concepts and applications. Which area of mathematics would you like to learn about?"
        }
    }

    // Default response for unknown queries
    return "I'm not sure I understand your question. I can help with topics in computer science, operating systems, networks, OOP, databases, AI/ML, and mathematics. I can also provide information about your courses, assignments, grades, and attendance. Could you please rephrase or specify what you'd like to know?"
}