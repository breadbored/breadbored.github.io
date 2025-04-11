import { useState } from 'react';

const SaveActImpactQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<{
        [key: string]: string;
    }>({});
    const [showResults, setShowResults] = useState(false);

    const questions = [
        {
            id: 'passport',
            text: 'Do you currently have a valid, unexpired U.S. passport?',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'I\'m not sure' }
            ]
        },
        {
            id: 'birthCertificate',
            text: 'Do you have your original birth certificate or a certified copy readily available?',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'I\'m not sure' }
            ]
        },
        {
            id: 'nameChange',
            text: 'Have you ever legally changed your name (e.g., through marriage, divorce, or other reasons)?',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' }
            ]
        },
        {
            id: 'nameDocuments',
            text: 'If you changed your name, do you have documentation (like a marriage certificate) that links your current legal name to the name on your birth certificate?',
            options: [
                { value: 'yes', label: 'Yes' },
                { value: 'no', label: 'No' },
                { value: 'unsure', label: 'I\'m not sure' },
                { value: 'notApplicable', label: 'Not applicable' }
            ],
            condition: (answers: Record<string, unknown>) => answers.nameChange === 'yes'
        },
        {
            id: 'distance',
            text: 'How far do you live from your local election office?',
            options: [
                { value: 'close', label: 'Less than 10 miles' },
                { value: 'medium', label: '10-30 miles' },
                { value: 'far', label: 'More than 30 miles' },
                { value: 'unsure', label: 'I\'m not sure' }
            ]
        },
        {
            id: 'registrationMethod',
            text: 'How did you last register to vote or update your registration?',
            options: [
                { value: 'inPerson', label: 'In person at an election office' },
                { value: 'mail', label: 'By mail' },
                { value: 'online', label: 'Online' },
                { value: 'dmv', label: 'At the DMV/through motor voter' },
                { value: 'drive', label: 'At a voter registration drive' },
                { value: 'notRegistered', label: 'I\'m not registered to vote' },
                { value: 'unsure', label: 'I don\'t remember' }
            ]
        }
    ];

    const handleAnswer = (questionId: string, value: string) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));

        // Find next eligible question
        const nextQuestionIndex = findNextQuestion(currentQuestion + 1);

        if (nextQuestionIndex < questions.length) {
            setCurrentQuestion(nextQuestionIndex);
        } else {
            setShowResults(true);
        }
    };

    const findNextQuestion = (startIndex: number) => {
        for (let i = startIndex; i < questions.length; i++) {
            const question = questions[i];
            if (!question.condition || question.condition(answers)) {
                return i;
            }
        }
        return questions.length; // No more eligible questions
    };

    const getImpactLevel = () => {
        let impactPoints = 0;

        // Lack of documentation
        if (answers.passport === 'no' || answers.passport === 'unsure') impactPoints += 2;
        if (answers.birthCertificate === 'no' || answers.birthCertificate === 'unsure') impactPoints += 2;

        // Name change issues
        if (answers.nameChange === 'yes' &&
            (answers.nameDocuments === 'no' || answers.nameDocuments === 'unsure')) {
            impactPoints += 3;
        }

        // Distance factors
        if (answers.distance === 'medium') impactPoints += 1;
        if (answers.distance === 'far') impactPoints += 2;

        // Registration method
        const nonInPersonMethods = ['mail', 'online', 'dmv', 'drive'];
        if (nonInPersonMethods.includes(answers.registrationMethod)) impactPoints += 2;

        // Determine impact level
        if (impactPoints >= 5) return 'high';
        if (impactPoints >= 3) return 'medium';
        return 'low';
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
    };

    const renderCurrentQuestion = (): JSX.Element | null => {
        const question = questions[currentQuestion];

        if (question.condition && !question.condition(answers)) {
            // Skip this question and move to the next
            const nextQuestionIndex = findNextQuestion(currentQuestion + 1);
            if (nextQuestionIndex < questions.length) {
                setCurrentQuestion(nextQuestionIndex);
                return renderCurrentQuestion();
            } else {
                setShowResults(true);
                return null;
            }
        }

        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
                <div className="space-y-3">
                    {question.options.map((option) => (
                        <button
                            key={option.value}
                            onClick={() => handleAnswer(question.id, option.value)}
                            className="w-full py-2 px-4 text-left border rounded-md 
                        hover:bg-blue-50 transition-colors"
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
                <div className="mt-4 text-gray-500 text-sm">
                    Question {currentQuestion + 1} of {questions.length}
                </div>
            </div>
        );
    };

    const renderResults = () => {
        const impactLevel = getImpactLevel();

        let impactDescription = "";
        let impactDetails = [];

        switch (impactLevel) {
            case 'high':
                impactDescription = "You may be significantly impacted by the SAVE Act if it becomes law.";
                break;
            case 'medium':
                impactDescription = "You may be moderately impacted by the SAVE Act if it becomes law.";
                break;
            case 'low':
                impactDescription = "You may not be substantially impacted by the SAVE Act if it becomes law, but could still face some challenges.";
                break;
            default:
                impactDescription = "We couldn't determine your impact level.";
        }

        // Add specific details based on answers
        if (answers.passport === 'no' && answers.birthCertificate === 'no') {
            impactDetails.push("You indicated you don't have readily available citizenship documents that would be required under the SAVE Act.");
        }

        if (answers.nameChange === 'yes' && answers.nameDocuments !== 'yes') {
            impactDetails.push("Your name change may create complications when trying to register with your citizenship documents.");
        }

        if (answers.distance === 'far') {
            impactDetails.push("The distance to your election office could make in-person registration more difficult.");
        }

        const nonInPersonMethods = ['mail', 'online', 'dmv', 'drive'];
        if (nonInPersonMethods.includes(answers.registrationMethod)) {
            impactDetails.push("Your preferred registration method would no longer be available without additional steps.");
        }

        return (
            <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Your Results</h2>

                <div className={`p-4 mb-4 rounded-md 
          ${impactLevel === 'high' ? 'bg-red-100 text-red-800' :
                        impactLevel === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'}`}>
                    <p className="font-medium">{impactDescription}</p>
                </div>

                {impactDetails.length > 0 && (
                    <div className="mt-4">
                        <h3 className="text-lg font-semibold mb-2">Key Factors:</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {impactDetails.map((detail, index) => (
                                <li key={index}>{detail}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div className="mt-6 p-4 bg-blue-50 rounded-md">
                    <h3 className="text-lg font-semibold mb-2">Important Disclaimer</h3>
                    <p>
                        This quiz provides only a general assessment based on limited factors. The SAVE Act's implementation
                        could vary by state, and many other circumstances could affect your personal situation. Even if this quiz
                        suggests minimal impact, you may still be affected in ways not covered here. This is not legal advice.
                    </p>
                </div>

                <button
                    onClick={restartQuiz}
                    className="mt-6 py-2 px-4 bg-blue-600 text-white rounded-md 
                   hover:bg-blue-700 transition-colors"
                >
                    Take the Quiz Again
                </button>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-center mb-2">SAVE Act Impact Assessment</h1>
                <p className="text-center text-gray-600">
                    This quiz helps estimate how the SAVE Act might affect your ability to register to vote.
                </p>
            </div>

            {!showResults ? renderCurrentQuestion() : renderResults()}
        </div>
    );
};

export default SaveActImpactQuiz;