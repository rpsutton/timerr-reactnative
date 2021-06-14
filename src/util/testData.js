/* eslint-disable prettier/prettier */
export default {
    todaysWorkout: [
    {
        title: 'Preparation',
        excercises: [
            {
                excerciseName: 'Foam Roll',
                description: 'Shins, calves, hamstrings, quads, it band, hipflexor, glutes, lowback, lats',
                measure: 'reps',
                weight: null,
                sets: [
                    {reps: 10, isComplete: false},
                ],
                eachSide: false,
            },
        ],

    },
    {
        title: 'Warm Up',
        noteFromCoach: 'Warming up is so important, save yourself from injury!',
        excercises: [
            {
                measure: 'time',
                excerciseName: 'Jumping Jacks',
                weight: null,
                description: '',
                sets: [
                    {duration: 60, isComplete: true},
                ],
                eachSide: false,
                restTime: 30, //seconds
                completeSets: 0,
            },
            {
                measure: 'time',
                excerciseName: 'Mountain Climbers',
                weight: null,
                description: '',
                sets: [
                    {duration: 60, isComplete: true},
                    {duration: 60, isComplete: false},
                ],
                eachSide: false,
                completeSets: 0,
                restTime: 30 //seconds
            },
            {
                measure: 'time',
                excerciseName: 'Quad Stretch',
                weight: null,
                description: 'Hold stretch for 30 seconds for each leg',
                sets: [
                    {duration: 60, isComplete: false},
                ],
                completeSets: 0,
                eachSide: true,
            },
            {
                measure: 'reps',
                excerciseName: 'Hip Rotations',
                weight: null,
                description: '',
                eachSide: true,
                sets: [
                    {reps: 15, isComplete: false},
                    {reps: 15, isComplete: false},
                ],
                completeSets: 0,
                restTime: 15 //seconds
            },
            {
                measure: 'time',
                excerciseName: 'Jumping Jacks',
                weight: null,
                description: '',
                sets: [
                    {duration: 60, isComplete: true},
                ],
                eachSide: false,
                restTime: 30, //seconds
                completeSets: 0,
            },
            {
                measure: 'time',
                excerciseName: 'Mountain Climbers',
                weight: null,
                description: '',
                sets: [
                    {duration: 60, isComplete: true},
                    {duration: 60, isComplete: false},
                ],
                eachSide: false,
                completeSets: 0,
                restTime: 30 //seconds
            },
            {
                measure: 'time',
                excerciseName: 'Quad Stretch',
                weight: null,
                description: 'Hold stretch for 30 seconds for each leg',
                sets: [
                    {duration: 60, isComplete: false},
                ],
                completeSets: 0,
                eachSide: true,
            },
            {
                measure: 'reps',
                excerciseName: 'Hip Rotations',
                weight: null,
                description: '',
                eachSide: true,
                sets: [
                    {reps: 15, isComplete: false},
                    {reps: 15, isComplete: false},
                ],
                completeSets: 0,
                restTime: 15 //seconds
            },
            {
                measure: 'time',
                excerciseName: 'Jumping Jacks',
                weight: null,
                description: '',
                sets: [
                    {duration: 60, isComplete: true},
                ],
                eachSide: false,
                restTime: 30, //seconds
                completeSets: 0,
            },
            {
                measure: 'time',
                excerciseName: 'Mountain Climbers',
                weight: null,
                description: '',
                sets: [
                    {duration: 60, isComplete: true},
                    {duration: 60, isComplete: false},
                ],
                eachSide: false,
                completeSets: 0,
                restTime: 30 //seconds
            },
            {
                measure: 'time',
                excerciseName: 'Quad Stretch',
                weight: null,
                description: 'Hold stretch for 30 seconds for each leg',
                sets: [
                    {duration: 60, isComplete: false},
                ],
                completeSets: 0,
                eachSide: true,
            },
            {
                measure: 'reps',
                excerciseName: 'Hip Rotations',
                weight: null,
                description: '',
                eachSide: true,
                sets: [
                    {reps: 15, isComplete: false},
                    {reps: 15, isComplete: false},
                ],
                completeSets: 0,
                restTime: 15 //seconds
            },
        ],
    },
    {
        title: 'Lift',
        excercises: [
            {
                measure: 'reps',
                muscleGroup: 'chest',
                excerciseName: 'Barbell Bench Press',
                description: '',
                weight: 135,
                reps: 8,
                eachSide: false,
                completeSets: 0,
                sets: [
                    {reps: 8, isComplte: false},
                    {reps: 8, isComplte: false},
                    {reps: 8, isComplte: false},
                    {reps: 8, isComplte: false},
                    {reps: 8, isComplte: false},
                ],
                restTime: 90 // seconds
            },
            {
                measure: 'reps',
                muscleGroup: 'chest',
                excerciseName: 'Incline Dumbell Press',
                description: '',
                weight: 45,
                eachSide: false,
                completeSets: 0,
                sets: [
                    {reps: 12, isComplete: false},
                    {reps: 12, isComplete: false},
                    {reps: 12, isComplete: false},
                    {reps: 12, isComplete: false},
                ],
                restTime: 90 // seconds
            },
            {
                measure: 'reps',
                muscleGroup: 'triceps',
                excerciseName: 'Tricep Cable Pushdown',
                description: '',
                weight: 30,
                eachSide: false,
                completeSets: 0,
                sets: [
                    {reps: 12, isComplete: false},
                    {reps: 12, isComplete: false},
                    {reps: 12, isComplete: false},
                    {reps: 12, isComplete: false},
                ],
                restTime: 60 // seconds
            },
            {
                measure: 'reps',
                muscleGroup: 'shoulders',
                excerciseName: 'Lateral Raises',
                description: '',
                weight: 15,
                eachSide: false,
                completeSets: 0,
                sets: [
                    {reps: 15, isComplete: false},
                    {reps: 15, isComplete: false},
                    {reps: 15, isComplete: false},
                    {reps: 15, isComplete: false},
                ],
                restTime: 60 // seconds
            },
        ],
    },
    /*
        'farlick' : [
                        {   type: 0,
                            distance: 50,
                            time: 5,
                        },
                        {
                            type: 2,
                            distance: 50,
                            time: 5,
                        },
                        {
                            type: 1,
                            distance: 50,
                            time: 10,
                        },
                        {
                            type: 2,
                            distance: 50,
                            time: 8,
                        },
                        {
                            type: 1,
                            distance: 50,
                            time: 18,
                        },
            ],*/

        ]
};
