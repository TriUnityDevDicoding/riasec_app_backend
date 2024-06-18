-- CreateTable
CREATE TABLE "questions_answers" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "score" BIGINT NOT NULL,
    "session_id" TEXT NOT NULL,
    "category_name" TEXT NOT NULL,

    CONSTRAINT "questions_answers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions_answers" ADD CONSTRAINT "questions_answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions_answers" ADD CONSTRAINT "questions_answers_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
