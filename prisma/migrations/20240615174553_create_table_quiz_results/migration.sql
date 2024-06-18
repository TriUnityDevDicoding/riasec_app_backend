-- CreateTable
CREATE TABLE "quiz_results" (
    "id" TEXT NOT NULL,
    "owner" TEXT NOT NULL,
    "realistic_score" BIGINT NOT NULL,
    "investigative_score" BIGINT NOT NULL,
    "artistic_score" BIGINT NOT NULL,
    "social_score" BIGINT NOT NULL,
    "enterprising_score" BIGINT NOT NULL,
    "conventional_score" BIGINT NOT NULL,
    "session_id" TEXT NOT NULL,
    "groq_response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "quiz_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_quiz_result_id_fkey" FOREIGN KEY ("quiz_result_id") REFERENCES "quiz_results"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_owner_fkey" FOREIGN KEY ("owner") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_results" ADD CONSTRAINT "quiz_results_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "sessions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
