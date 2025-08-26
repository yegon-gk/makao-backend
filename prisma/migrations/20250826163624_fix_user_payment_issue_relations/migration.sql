/*
  Warnings:

  - You are about to drop the column `user_id` on the `Booking` table. All the data in the column will be lost.
  - Added the required column `check_in` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_out` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Booking" DROP CONSTRAINT "Booking_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Booking" DROP COLUMN "user_id",
ADD COLUMN     "booking_status" TEXT,
ADD COLUMN     "check_in" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "check_out" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "payment_status" TEXT,
ADD COLUMN     "tenant_id" INTEGER NOT NULL,
ADD COLUMN     "total_amount" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "public"."Property" ADD COLUMN     "amenities" JSONB,
ADD COLUMN     "bedrooms" INTEGER,
ADD COLUMN     "cancellation_policy" TEXT,
ADD COLUMN     "house_rules" TEXT,
ADD COLUMN     "images" JSONB,
ADD COLUMN     "location_data" JSONB,
ADD COLUMN     "price" DOUBLE PRECISION,
ADD COLUMN     "property_type" TEXT,
ADD COLUMN     "status" TEXT DEFAULT 'available',
ADD COLUMN     "target_group" TEXT;

-- CreateTable
CREATE TABLE "public"."Queue" (
    "queue_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "position" INTEGER,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notification_sent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT DEFAULT 'active',

    CONSTRAINT "Queue_pkey" PRIMARY KEY ("queue_id")
);

-- CreateTable
CREATE TABLE "public"."Payment" (
    "payment_id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "commission" DOUBLE PRECISION,
    "payout_amount" DOUBLE PRECISION,
    "payment_method" TEXT,
    "transaction_id" TEXT,
    "status" TEXT,
    "processed_at" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "public"."Issue" (
    "issue_id" SERIAL NOT NULL,
    "tenant_id" INTEGER NOT NULL,
    "property_id" INTEGER NOT NULL,
    "landlord_id" INTEGER NOT NULL,
    "issue_type" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT,
    "reported_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "Issue_pkey" PRIMARY KEY ("issue_id")
);

-- AddForeignKey
ALTER TABLE "public"."Booking" ADD CONSTRAINT "Booking_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Queue" ADD CONSTRAINT "Queue_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Queue" ADD CONSTRAINT "Queue_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("property_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "public"."Booking"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Payment" ADD CONSTRAINT "Payment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_landlord_id_fkey" FOREIGN KEY ("landlord_id") REFERENCES "public"."User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Issue" ADD CONSTRAINT "Issue_property_id_fkey" FOREIGN KEY ("property_id") REFERENCES "public"."Property"("property_id") ON DELETE RESTRICT ON UPDATE CASCADE;
