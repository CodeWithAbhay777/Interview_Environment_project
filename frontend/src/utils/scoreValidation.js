export function validateScoreData(scoreData) {
	if (!scoreData || typeof scoreData !== "object") {
		return { isValid: false, message: "Score data is required" };
	}

	if (!scoreData.interviewId?.toString().trim()) {
		return { isValid: false, message: "Interview ID is required" };
	}

	const requiredCriteria = [
		"problemSolving",
		"communication",
		"technicalKnowledge",
		"confidence",
		"overallImpression",
	];

	if (!scoreData.scores || typeof scoreData.scores !== "object") {
		return { isValid: false, message: "Scores are required" };
	}

	for (const criterion of requiredCriteria) {
		const value = Number(scoreData.scores[criterion]);

		if (isNaN(value)) {
			return { isValid: false, message: `${criterion} score must be a number` };
		}

		if (value < 0 || value > 10) {
			return { isValid: false, message: `${criterion} score must be between 0 and 10` };
		}
	}

	const calculatedTotal = requiredCriteria.reduce(
		(sum, criterion) => sum + Number(scoreData.scores[criterion]),
		0
	);

	const totalScore = Number(scoreData.totalScore);
	if (isNaN(totalScore)) {
		return { isValid: false, message: "Total score must be a number" };
	}
	if (totalScore !== calculatedTotal) {
		return { isValid: false, message: "Total score does not match criterion scores" };
	}

	const maxScore = Number(scoreData.maxScore);
	if (isNaN(maxScore)) {
		return { isValid: false, message: "Max score must be a number" };
	}
	if (maxScore <= 0) {
		return { isValid: false, message: "Max score must be greater than zero" };
	}

	const percentage = Number(scoreData.percentage);
	if (isNaN(percentage)) {
		return { isValid: false, message: "Percentage must be a number" };
	}
	if (percentage < 0 || percentage > 100) {
		return { isValid: false, message: "Percentage must be between 0 and 100" };
	}

	if (
		scoreData.recommendation !== undefined &&
		scoreData.recommendation !== null &&
		typeof scoreData.recommendation !== "string"
	) {
		return { isValid: false, message: "Recommendation must be a string" };
	}

	return { isValid: true, message: "Valid score data" };
}
