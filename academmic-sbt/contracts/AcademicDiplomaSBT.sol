// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Контракт для видачі дипломів у вигляді Soulbound Token (непередаваних токенів)
contract AcademicDiplomaSBT {

    // Адреса власника контракту (адміністратора)
    address public owner;

    // Лічильник виданих дипломів
    uint256 public nextTokenId;

    // Структура диплома
    struct Diploma {

        // Адреса студента
        address student;

        // Ім'я студента
        string studentName;

        // Назва курсу або спеціальності
        string courseName;

        // Дата видачі диплома (timestamp)
        uint256 issueDate;

        // Статус диплома:
        // true - дійсний
        // false - відкликаний
        bool valid;
    }

    // Зберігання дипломів за їх ID
    mapping(uint256 => Diploma) public diplomas;

    // Для кожного студента зберігається список його дипломів
    mapping(address => uint256[]) private studentDiplomas;

    // Конструктор виконується один раз під час деплою контракту
    constructor() {
        owner = msg.sender;
    }

    // Модифікатор перевіряє, що функцію викликає власник контракту
    modifier onlyOwner() {

        require(msg.sender == owner, "Not owner");
        _;
    }

    // видача диплома студенту

    function issueDiploma(
        address student,
        string memory studentName,
        string memory courseName
    )
        external
        onlyOwner
    {
        // Збільшуємо ID наступного диплома
        nextTokenId++;

        // Створюємо новий диплом
        diplomas[nextTokenId] = Diploma({
            student: student,
            studentName: studentName,
            courseName: courseName,
            issueDate: block.timestamp,
            valid: true
        });

        // Додаємо диплом до списку дипломів студента
        studentDiplomas[student].push(nextTokenId);
    }

    
    // перевірка диплома
    function verifyDiploma(uint256 tokenId)
        external
        view
        returns (bool)
    {
        // Перевірка існування диплома
        require(
            tokenId > 0 &&
            tokenId <= nextTokenId,
            "Invalid token"
        );

        // Повертаємо статус диплома
        return diplomas[tokenId].valid;
    }

  
    // відкликання диплома (робить його недійсним)
    function revokeDiploma(uint256 tokenId)
        external
        onlyOwner
    {
        // Перевірка існування диплома
        require(
            tokenId > 0 &&
            tokenId <= nextTokenId,
            "Invalid token"
        );

        // Позначаємо диплом як недійсний
        diplomas[tokenId].valid = false;
    }

    // отрмання інформації про диплом за його ID
    function getDiploma(uint256 tokenId)
        external
        view
        returns (
            address,
            string memory,
            string memory,
            uint256,
            bool
        )
    {
        // Перевірка існування диплома
        require(
            tokenId > 0 &&
            tokenId <= nextTokenId,
            "Invalid token"
        );

        // Отримуємо диплом із сховища
        Diploma memory d = diplomas[tokenId];

        // Повертаємо всі дані диплома
        return (
            d.student,
            d.studentName,
            d.courseName,
            d.issueDate,
            d.valid
        );
    }

    
    // ОТРИМАННЯ СПИСКУ ДИПЛОМІВ СТУДЕНТА

    function getStudentDiplomas(address student)
        external
        view
        returns (uint256[] memory)
    {
        // Повертаємо масив ID дипломів студента
        return studentDiplomas[student];
    }
}