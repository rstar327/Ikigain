import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Question } from "@shared/schema";
import { useTranslation } from "react-i18next";

interface TestQuestionProps {
  question: Question;
  selectedValue?: number;
  onAnswer: (questionId: number, value: number) => void;
}

export default function TestQuestion({ question, selectedValue, onAnswer }: TestQuestionProps) {
  const [selected, setSelected] = useState(selectedValue);
  const { t } = useTranslation(['test']);
  
  // Reset selected value when question changes
  useEffect(() => {
    setSelected(selectedValue);
  }, [question.id, selectedValue]);

  const { data: answerOptions, isLoading } = useQuery({
    queryKey: ["/api/questions", question.id, "options"],
    queryFn: async () => {
      const response = await fetch(`/api/questions/${question.id}/options`);
      if (!response.ok) throw new Error("Failed to fetch answer options");
      return response.json();
    },
  });

  const handleSelect = (value: number) => {
    setSelected(value);
    onAnswer(question.id, value);
  };

  // Get translated question text and options
  const getTranslatedQuestion = (questionId: number) => {
    const translationKey = `test:testQuestions.${questionId}.text`;
    const translatedText = t(translationKey);
    return translatedText !== translationKey ? translatedText : question.text;
  };

  const getTranslatedOption = (optionId: number, fallbackText: string) => {
    const translationKey = `test:testQuestions.${question.id}.options.${optionId}`;
    const translatedText = t(translationKey);
    return translatedText !== translationKey ? translatedText : fallbackText;
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto" />
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          {getTranslatedQuestion(question.id)}
        </h2>
        <p className="text-gray-600 mb-2">
          {t('instruction')}
        </p>
        <p className="text-sm text-gray-500">
          💡 {t('instructions.tip')}
        </p>
      </div>

      <div className="space-y-4">
        {answerOptions?.map((option: any) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full p-4 text-left border rounded-lg transition-all duration-200 hover:scale-[1.02] ${
              selected === option.value
                ? "border-primary bg-primary/10 ring-2 ring-primary/20 shadow-md"
                : "border-gray-200 hover:border-primary/50 hover:bg-primary/5 hover:shadow-sm"
            }`}
          >
            <div className="flex items-start">
              <div className={`w-4 h-4 rounded-full mr-3 border-2 flex-shrink-0 mt-1 ${
                selected === option.value
                  ? "bg-primary border-primary"
                  : "border-gray-300"
              }`} />
              <span className="text-gray-900 text-left leading-relaxed break-words">{getTranslatedOption(option.id, option.text)}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
