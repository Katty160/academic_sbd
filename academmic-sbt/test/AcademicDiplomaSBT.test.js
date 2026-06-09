const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AcademicDiplomaSBT", function () {

    // Змінні для контракту та акаунтів
    let diploma;
    let owner;
    let student;
    let other;

    // Виконується перед кожним тестом
    beforeEach(async function () {

        // Отримуємо тестові акаунти Hardhat
        [owner, student, other] = await ethers.getSigners();

        // Отримуємо фабрику контракту
        const Diploma = await ethers.getContractFactory(
            "AcademicDiplomaSBT"
        );

        // Деплоїмо новий екземпляр контракту
        diploma = await Diploma.deploy();

        // Чекаємо завершення деплою
        await diploma.waitForDeployment();
    });

    // тест видачі диплома
    it("Should issue diploma", async function () {

        // Видаємо диплом студенту
        await diploma.issueDiploma(
            student.address,
            "Ivan Petrenko",
            "Solidity"
        );

        // Отримуємо дані диплома
        const data = await diploma.getDiploma(1);

        // Перевіряємо правильність збережених даних
        expect(data[0]).to.equal(student.address);
        expect(data[1]).to.equal("Ivan Petrenko");
        expect(data[2]).to.equal("Solidity");
        expect(data[4]).to.equal(true);
    });

    // тест перевірки диплома
    it("Should verify diploma", async function () {

        await diploma.issueDiploma(
            student.address,
            "Ivan Petrenko",
            "Solidity"
        );

        // Перевіряємо, що диплом дійсний
        expect(
            await diploma.verifyDiploma(1)
        ).to.equal(true);
    });

    // тест відкликання диплома
    it("Should revoke diploma", async function () {

        await diploma.issueDiploma(
            student.address,
            "Ivan Petrenko",
            "Solidity"
        );

        // Відкликаємо диплом
        await diploma.revokeDiploma(1);

        // Перевіряємо, що він став недійсним
        expect(
            await diploma.verifyDiploma(1)
        ).to.equal(false);
    });


    // лише власник може видати диплом
    it("Only owner can issue diploma", async function () {

        await expect(

            // Студент намагається видати диплом
            diploma
                .connect(student)
                .issueDiploma(
                    student.address,
                    "Ivan",
                    "Blockchain"
                )

        ).to.be.revertedWith("Not owner");
    });


    // лише власник може відкликати дипломи
    it("Only owner can revoke diploma", async function () {

        await diploma.issueDiploma(
            student.address,
            "Ivan",
            "Blockchain"
        );

        await expect(

            // Студент намагається відкликати диплом
            diploma
                .connect(student)
                .revokeDiploma(1)

        ).to.be.revertedWith("Not owner");
    });

    // отримання всіх дипломів студента 
    it("Should return student diplomas", async function () {

        // Видаємо перший диплом
        await diploma.issueDiploma(
            student.address,
            "Ivan",
            "Solidity"
        );

        // Видаємо другий диплом
        await diploma.issueDiploma(
            student.address,
            "Ivan",
            "Ethereum"
        );

        // Отримуємо список дипломів студента
        const ids =
            await diploma.getStudentDiplomas(
                student.address
            );

        // Перевіряємо кількість дипломів
        expect(ids.length).to.equal(2);

        // Перевіряємо їх ID
        expect(ids[0]).to.equal(1);
        expect(ids[1]).to.equal(2);
    });

});