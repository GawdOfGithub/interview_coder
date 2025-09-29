export const DUMMY_FULLSTACK_MCQS = [
    {
        id: 'fs-1',
        question: 'Which HTTP method should be idempotent according to REST semantics?',
        options: ['POST', 'PUT', 'PATCH', 'CONNECT'],
        correctAnswer: 'PUT',
        difficulty: 'Easy',
        timeLimit: 60
    },
    {
        id: 'fs-2',
        question: 'In React, which hook is used to access the Redux store state?',
        options: ['useStore', 'useSelector', 'useDispatch', 'useReducer'],
        correctAnswer: 'useSelector',
        difficulty: 'Easy',
        timeLimit: 60
    },
    {
        id: 'fs-3',
        question: 'What does `await` do in JavaScript?',
        options: [
            'Blocks the thread until the promise resolves',
            'Pauses async function execution until the promise settles',
            'Retries a promise until it succeeds',
            'Converts a callback into a promise'
        ],
        correctAnswer: 'Pauses async function execution until the promise settles',
        difficulty: 'Medium',
        timeLimit: 60
    },
    {
        id: 'fs-4',
        question: 'Which HTTP status code best represents “resource created”?',
        options: ['200', '201', '204', '301'],
        correctAnswer: '201',
        difficulty: 'Easy',
        timeLimit: 60
    },
    {
        id: 'fs-5',
        question: 'In MongoDB, which of the following creates an index?',
        options: [
            'db.collection.ensureIndex({ field: 1 })',
            'db.collection.addIndex({ field: 1 })',
            'db.collection.createIndex({ field: 1 })',
            'db.collection.makeIndex({ field: 1 })'
        ],
        correctAnswer: 'db.collection.createIndex({ field: 1 })',
        difficulty: 'Medium',
        timeLimit: 60
    }
];


