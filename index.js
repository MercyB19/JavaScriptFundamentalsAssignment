// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript",
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50,
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150,
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500,
      },
    ],
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47,
      },
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150,
      },
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400,
      },
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39,
      },
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140,
      },
    },
  ];
  
  function getLearnerData(course, ag, submissions) {
    try {
      // Validate the course and assignment group
      if (ag.course_id != course.id) {
        throw new Error(`Assignment group ${ag.id} does not belong to course ${course.id}`);
      }

    // Helper function to check if a date is in the past
    function isPastDue(dateStr) {
      return new Date(dateStr) < new Date();
    }

    // Prepare data for processing
    let learnersData = {};

    // Process each leaner submission
    submissions.forEach(submission => {
      const { learner_id, assignment_id, submission: { submitted_at, score } } = submission;

    // Find the assignment
      let assignment = ag.assignments.find(a => a.id === assignment_id);
      if (!assignment) {
        throw new Error('Assignment ${assignment_id} not found');
      }

      // Check if the assignment is due
      if (!isPastDue(assignment.due_at)) {
        return; // skip not yet due assignments
      }

      // Initialize leaner data if not already done
      if (!learnersData[learner_id]) {
        learnersData[learner_id] = {
          id: learner_id,
          totalScore: 0,
          totalPossible: 0,
          assignments: {}
        };
      }

      // Deduct points for late submission
      let effectiveScore = new Date(submitted_at) > new Date(assignment.due_at) ? score * 0.9 : score;

      // Update leaner data
      learnersData[learner_id].totalScore += effectiveScore;
      learnersData[learner_id].totalPossible += assignment.points_possible;
      learnersData[learner_id].assignments[assignment_id] = (effectiveScore / assignment.points_possible) * 100;
    });

    // Format the final result
    let result = [];
    for (let learner_id in learnersData) {
      let learner = learnersData[learner_id];
      result.push({
        id: learner.id,
        avg: (learner.totalScore / learner.totalPossible) * 100,
        ...learner.assignments
      });
    }

    return result;
  } catch (error) {
    console.error("Error processing learner data:", error.message);
  }
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

console.log(result);

 

   
  