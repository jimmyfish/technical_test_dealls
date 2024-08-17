-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('free', 'premium');

-- CreateEnum
CREATE TYPE "Decision" AS ENUM ('left', 'right');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('pending', 'complete', 'failed', 'expired');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('settle', 'refund');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "first_name" VARCHAR(100) NOT NULL,
    "last_name" VARCHAR(100),
    "gender" "Gender",
    "date_of_birth" DATE,
    "phone_number" TEXT NOT NULL,
    "remember_token" VARCHAR(255),
    "plan_type" "PlanType" NOT NULL DEFAULT 'free',
    "last_login" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_preferences" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "radius" DOUBLE PRECISION NOT NULL DEFAULT 3,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "matches" (
    "id" UUID NOT NULL,
    "from_user_id" UUID NOT NULL,
    "to_user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "matches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation_histories" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "to_user_id" UUID NOT NULL,
    "decision" "Decision" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "recommendation_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" UUID NOT NULL,
    "user_id" UUID,
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "order_status" "OrderStatus" NOT NULL DEFAULT 'pending',
    "expired_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_histories" (
    "id" UUID NOT NULL,
    "order_id" UUID,
    "payment_reference" VARCHAR(100) NOT NULL,
    "payment_type" VARCHAR(100) NOT NULL,
    "settlement_time" TIMESTAMPTZ,
    "status_message" VARCHAR(100),
    "signature" VARCHAR(100),
    "gross_amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "currency" VARCHAR(10),
    "metadata" JSON,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "payment_histories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" UUID NOT NULL,
    "order_id" UUID NOT NULL,
    "payment_history_id" UUID NOT NULL,
    "transaction_type" "TransactionType" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "otp_lists" (
    "id" UUID NOT NULL,
    "key" VARCHAR(20) NOT NULL,
    "value" VARCHAR(255) NOT NULL,
    "expiredAt" TIMESTAMPTZ NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ,
    "deleted_at" TIMESTAMPTZ,

    CONSTRAINT "otp_lists_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_number_key" ON "users"("phone_number");

-- CreateIndex
CREATE INDEX "users_id_first_name_gender_idx" ON "users"("id", "first_name", "gender");

-- CreateIndex
CREATE INDEX "user_preferences_id_user_id_idx" ON "user_preferences"("id", "user_id");

-- CreateIndex
CREATE INDEX "matches_id_from_user_id_to_user_id_idx" ON "matches"("id", "from_user_id", "to_user_id");

-- CreateIndex
CREATE INDEX "recommendation_histories_id_user_id_to_user_id_idx" ON "recommendation_histories"("id", "user_id", "to_user_id");

-- CreateIndex
CREATE INDEX "orders_id_user_id_order_status_idx" ON "orders"("id", "user_id", "order_status");

-- CreateIndex
CREATE INDEX "payment_histories_id_order_id_payment_reference_payment_typ_idx" ON "payment_histories"("id", "order_id", "payment_reference", "payment_type");

-- CreateIndex
CREATE INDEX "transaction_id_order_id_payment_history_id_idx" ON "transaction"("id", "order_id", "payment_history_id");

-- CreateIndex
CREATE INDEX "otp_lists_id_key_idx" ON "otp_lists"("id", "key");

-- AddForeignKey
ALTER TABLE "user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_from_user_id_fkey" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "matches" ADD CONSTRAINT "matches_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_histories" ADD CONSTRAINT "recommendation_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation_histories" ADD CONSTRAINT "recommendation_histories_to_user_id_fkey" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_histories" ADD CONSTRAINT "payment_histories_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_payment_history_id_fkey" FOREIGN KEY ("payment_history_id") REFERENCES "payment_histories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
