 // SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AcademicDiplomaSBT {

    address public owner;
    uint256 public nextTokenId;

    struct Diploma {
        address student;
        string studentName;
        string courseName;
        uint256 issueDate;
        bool valid;
    }

    mapping(uint256 => Diploma) public diplomas;
    mapping(address => uint256[]) private studentDiplomas;

    constructor() {
        owner = 0x8dF17F224804B8793e420579c41E3Ed346667A57;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // 📌 ВИДАЧА ДИПЛОМА
    function issueDiploma(
        address student,
        string memory studentName,
        string memory courseName
    ) external onlyOwner {

        nextTokenId++;

        diplomas[nextTokenId] = Diploma({
            student: student,
            studentName: studentName,
            courseName: courseName,
            issueDate: block.timestamp,
            valid: true
        });

        studentDiplomas[student].push(nextTokenId);
    }

    // 📌 ПЕРЕВІРКА
    function verifyDiploma(uint256 tokenId)
        external
        view
        returns (bool)
    {
        require(tokenId > 0 && tokenId <= nextTokenId, "Invalid token");
        return diplomas[tokenId].valid;
    }

    // 📌 ВІДКЛИКАННЯ
    function revokeDiploma(uint256 tokenId)
        external
        onlyOwner
    {
        require(tokenId > 0 && tokenId <= nextTokenId, "Invalid token");
        diplomas[tokenId].valid = false;
    }

    // 📌 ОТРИМАТИ ДИПЛОМ
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
        require(tokenId > 0 && tokenId <= nextTokenId, "Invalid token");

        Diploma memory d = diplomas[tokenId];

        return (
            d.student,
            d.studentName,
            d.courseName,
            d.issueDate,
            d.valid
        );
    }

    // 📌 ВАЖЛИВО ДЛЯ ТВОГО ТЕСТУ
    function getStudentDiplomas(address student)
        external
        view
        returns (uint256[] memory)
    {
        return studentDiplomas[student];
    }
}