-- CreateTable
CREATE TABLE "_GlobalBetChampionsPositions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalBetChampionsPositions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GlobalBetUefaPositions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalBetUefaPositions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GlobalBetDemotionPositions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalBetDemotionPositions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GlobalResultsChampionsPositions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalResultsChampionsPositions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GlobalResultsUefaPositions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalResultsUefaPositions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_GlobalResultsDemotionPositions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_GlobalResultsDemotionPositions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_GlobalBetChampionsPositions_B_index" ON "_GlobalBetChampionsPositions"("B");

-- CreateIndex
CREATE INDEX "_GlobalBetUefaPositions_B_index" ON "_GlobalBetUefaPositions"("B");

-- CreateIndex
CREATE INDEX "_GlobalBetDemotionPositions_B_index" ON "_GlobalBetDemotionPositions"("B");

-- CreateIndex
CREATE INDEX "_GlobalResultsChampionsPositions_B_index" ON "_GlobalResultsChampionsPositions"("B");

-- CreateIndex
CREATE INDEX "_GlobalResultsUefaPositions_B_index" ON "_GlobalResultsUefaPositions"("B");

-- CreateIndex
CREATE INDEX "_GlobalResultsDemotionPositions_B_index" ON "_GlobalResultsDemotionPositions"("B");

-- AddForeignKey
ALTER TABLE "_GlobalBetChampionsPositions" ADD CONSTRAINT "_GlobalBetChampionsPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalBet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalBetChampionsPositions" ADD CONSTRAINT "_GlobalBetChampionsPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalBetUefaPositions" ADD CONSTRAINT "_GlobalBetUefaPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalBet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalBetUefaPositions" ADD CONSTRAINT "_GlobalBetUefaPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalBetDemotionPositions" ADD CONSTRAINT "_GlobalBetDemotionPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalBet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalBetDemotionPositions" ADD CONSTRAINT "_GlobalBetDemotionPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalResultsChampionsPositions" ADD CONSTRAINT "_GlobalResultsChampionsPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalResults"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalResultsChampionsPositions" ADD CONSTRAINT "_GlobalResultsChampionsPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalResultsUefaPositions" ADD CONSTRAINT "_GlobalResultsUefaPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalResults"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalResultsUefaPositions" ADD CONSTRAINT "_GlobalResultsUefaPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalResultsDemotionPositions" ADD CONSTRAINT "_GlobalResultsDemotionPositions_A_fkey" FOREIGN KEY ("A") REFERENCES "GlobalResults"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GlobalResultsDemotionPositions" ADD CONSTRAINT "_GlobalResultsDemotionPositions_B_fkey" FOREIGN KEY ("B") REFERENCES "Team"("id") ON DELETE CASCADE ON UPDATE CASCADE;
