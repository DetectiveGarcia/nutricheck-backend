-- CreateTable
CREATE TABLE "ChatGPTRes" (
    "id" TEXT NOT NULL,
    "productTitle" TEXT NOT NULL,
    "chatGPTRes" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ChatGPTRes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ChatGPTRes" ADD CONSTRAINT "ChatGPTRes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
