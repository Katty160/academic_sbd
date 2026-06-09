const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AcademicDiplomaSBT", function () {
    let diploma;
    let owner;
    let student;
    let other;

    beforeEach(async function () {
        [owner, student, other] = await ethers.getSigners();

        const Diploma = await ethers.getContractFactory(
            "AcademicDiplomaSBT"
        );

        diploma = await Diploma.deploy();
        await diploma.waitForDeployment();
    });

    it("Should issue diploma", async function () {
        await diploma.issueDiploma(
            student.address,
            "Ivan Petrenko",
            "Solidity"
        );

        const data = await diploma.getDiploma(1);

        expect(data[0]).to.equal(student.address);
        expect(data[1]).to.equal("Ivan Petrenko");
        expect(data[2]).to.equal("Solidity");
        expect(data[4]).to.equal(true);
    });

    it("Should verify diploma", async function () {
        await diploma.issueDiploma(
            student.address,
            "Ivan Petrenko",
            "Solidity"
        );

        expect(
            await diploma.verifyDiploma(1)
        ).to.equal(true);
    });

    it("Should revoke diploma", async function () {
        await diploma.issueDiploma(
            student.address,
            "Ivan Petrenko",
            "Solidity"
        );

        await diploma.revokeDiploma(1);

        expect(
            await diploma.verifyDiploma(1)
        ).to.equal(false);
    });

    it("Only owner can issue diploma", async function () {
        await expect(
            diploma
                .connect(student)
                .issueDiploma(
                    student.address,
                    "Ivan",
                    "Blockchain"
                )
        ).to.be.revertedWith("Not owner");
    });

    it("Only owner can revoke diploma", async function () {
        await diploma.issueDiploma(
            student.address,
            "Ivan",
            "Blockchain"
        );

        await expect(
            diploma
                .connect(student)
                .revokeDiploma(1)
        ).to.be.revertedWith("Not owner");
    });

    it("Should return student diplomas", async function () {
        await diploma.issueDiploma(
            student.address,
            "Ivan",
            "Solidity"
        );

        await diploma.issueDiploma(
            student.address,
            "Ivan",
            "Ethereum"
        );

        const ids =
            await diploma.getStudentDiplomas(
                student.address
            );

        expect(ids.length).to.equal(2);
        expect(ids[0]).to.equal(1);
        expect(ids[1]).to.equal(2);
    });
});