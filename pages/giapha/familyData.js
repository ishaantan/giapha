// familyData.js
export const familyData = {
    nodes: {
        // Đời 1 (Ông Tổ)
        N1: {
            id: 'N1',
            name: 'Nguyễn Văn Minh',
            birthYear: 1900,
            generation: 1,
            spouses: [{
                id: 'SP1',
                name: 'Trần Thị Hoa',
                birthYear: 1902,
                marriageYear: 1920
            }]
        },

        // Đời 2 (Con của Ông Tổ - 4 người)
        N2: {
            id: 'N2',
            name: 'Nguyễn Văn An',
            birthYear: 1925,
            generation: 2,
            motherId: 'SP1',
            spouses: [{
                id: 'SP2',
                name: 'Lê Thị Mai',
                birthYear: 1928,
                marriageYear: 1945
            }]
        },
        N3: {
            id: 'N3',
            name: 'Nguyễn Thị Liên',
            birthYear: 1927,
            generation: 2,
            motherId: 'SP1',
            spouses: [{
                id: 'SP3',
                name: 'Phạm Văn Đức',
                birthYear: 1925,
                marriageYear: 1944
            }]
        },
        N4: {
            id: 'N4',
            name: 'Nguyễn Văn Bình',
            birthYear: 1930,
            generation: 2,
            motherId: 'SP1',
            spouses: [{
                id: 'SP4',
                name: 'Hoàng Thị Lan',
                birthYear: 1932,
                marriageYear: 1950
            }]
        },
        N5: {
            id: 'N5',
            name: 'Nguyễn Văn Cường',
            birthYear: 1932,
            generation: 2,
            motherId: 'SP1',
            spouses: [{
                id: 'SP5',
                name: 'Vũ Thị Hương',
                birthYear: 1935,
                marriageYear: 1952
            }]
        },

        // Đời 3 (Cháu của Ông Tổ - 12 người)
        // Con của N2
        N6: {
            id: 'N6',
            name: 'Nguyễn Văn Dũng',
            birthYear: 1950,
            generation: 3,
            motherId: 'SP2',
            spouses: [{
                id: 'SP6',
                name: 'Trần Thị Thu',
                birthYear: 1952,
                marriageYear: 1970
            }]
        },
        N7: {
            id: 'N7',
            name: 'Nguyễn Thị Hà',
            birthYear: 1952,
            generation: 3,
            motherId: 'SP2',
            spouses: [{
                id: 'SP7',
                name: 'Lý Văn Nam',
                birthYear: 1950,
                marriageYear: 1971
            }]
        },
        N8: {
            id: 'N8',
            name: 'Nguyễn Văn Em',
            birthYear: 1955,
            generation: 3,
            motherId: 'SP2'
        },

        // Con của N3
        N9: {
            id: 'N9',
            name: 'Phạm Văn Tuấn',
            birthYear: 1951,
            generation: 3,
            motherId: 'SP3',
            spouses: [{
                id: 'SP8',
                name: 'Ngô Thị Thúy',
                birthYear: 1953,
                marriageYear: 1972
            }]
        },
        N10: {
            id: 'N10',
            name: 'Phạm Thị Thủy',
            birthYear: 1953,
            generation: 3,
            motherId: 'SP3'
        },

        // Con của N4
        N11: {
            id: 'N11',
            name: 'Nguyễn Văn Phong',
            birthYear: 1955,
            generation: 3,
            motherId: 'SP4',
            spouses: [{
                id: 'SP9',
                name: 'Đặng Thị Hồng',
                birthYear: 1957,
                marriageYear: 1975
            }]
        },
        N12: {
            id: 'N12',
            name: 'Nguyễn Thị Quỳnh',
            birthYear: 1957,
            generation: 3,
            motherId: 'SP4',
            spouses: [{
                id: 'SP10',
                name: 'Trịnh Văn Long',
                birthYear: 1955,
                marriageYear: 1976
            }]
        },
        N13: {
            id: 'N13',
            name: 'Nguyễn Văn Khang',
            birthYear: 1960,
            generation: 3,
            motherId: 'SP4'
        },

        // Con của N5
        N14: {
            id: 'N14',
            name: 'Nguyễn Văn Mạnh',
            birthYear: 1958,
            generation: 3,
            motherId: 'SP5',
            spouses: [{
                id: 'SP11',
                name: 'Lê Thị Nga',
                birthYear: 1960,
                marriageYear: 1978
            }]
        },
        N15: {
            id: 'N15',
            name: 'Nguyễn Thị Ngọc',
            birthYear: 1960,
            generation: 3,
            motherId: 'SP5'
        },

        // Đời 4 (Chắt của Ông Tổ - 15 người)
        // Con của N6
        N16: {
            id: 'N16',
            name: 'Nguyễn Văn Hiếu',
            birthYear: 1975,
            generation: 4,
            motherId: 'SP6',
            spouses: [{
                id: 'SP12',
                name: 'Phạm Thị Loan',
                birthYear: 1978,
                marriageYear: 1995
            }]
        },
        N17: {
            id: 'N17',
            name: 'Nguyễn Thị Hương',
            birthYear: 1978,
            generation: 4,
            motherId: 'SP6'
        },

        // Con của N7
        N18: {
            id: 'N18',
            name: 'Lý Văn Hùng',
            birthYear: 1976,
            generation: 4,
            motherId: 'SP7',
            spouses: [{
                id: 'SP13',
                name: 'Trần Thị Mai',
                birthYear: 1979,
                marriageYear: 1997
            }]
        },

        // Con của N9
        N19: {
            id: 'N19',
            name: 'Phạm Văn Minh',
            birthYear: 1977,
            generation: 4,
            motherId: 'SP8'
        },
        N20: {
            id: 'N20',
            name: 'Phạm Thị Linh',
            birthYear: 1980,
            generation: 4,
            motherId: 'SP8'
        },

        // Con của N11
        N21: {
            id: 'N21',
            name: 'Nguyễn Văn Tùng',
            birthYear: 1980,
            generation: 4,
            motherId: 'SP9',
            spouses: [{
                id: 'SP14',
                name: 'Hoàng Thị Thảo',
                birthYear: 1982,
                marriageYear: 2000
            }]
        },
        N22: {
            id: 'N22',
            name: 'Nguyễn Thị Trang',
            birthYear: 1982,
            generation: 4,
            motherId: 'SP9'
        },

        // Con của N12
        N23: {
            id: 'N23',
            name: 'Trịnh Văn Đạt',
            birthYear: 1981,
            generation: 4,
            motherId: 'SP10'
        },
        N24: {
            id: 'N24',
            name: 'Trịnh Thị Thu',
            birthYear: 1983,
            generation: 4,
            motherId: 'SP10'
        },

        // Con của N14
        N25: {
            id: 'N25',
            name: 'Nguyễn Văn Thắng',
            birthYear: 1983,
            generation: 4,
            motherId: 'SP11',
            spouses: [{
                id: 'SP15',
                name: 'Vũ Thị Hoa',
                birthYear: 1985,
                marriageYear: 2003
            }]
        },

        // Đời 5 (Chút của Ông Tổ - 10 người)
        // Con của N16
        N26: {
            id: 'N26',
            name: 'Nguyễn Văn Nam',
            birthYear: 2000,
            generation: 5,
            motherId: 'SP12'
        },
        N27: {
            id: 'N27',
            name: 'Nguyễn Thị Nhung',
            birthYear: 2002,
            generation: 5,
            motherId: 'SP12'
        },

        // Con của N18
        N28: {
            id: 'N28',
            name: 'Lý Văn Quân',
            birthYear: 2001,
            generation: 5,
            motherId: 'SP13'
        },

        // Con của N21
        N29: {
            id: 'N29',
            name: 'Nguyễn Văn Hải',
            birthYear: 2005,
            generation: 5,
            motherId: 'SP14'
        },
        N30: {
            id: 'N30',
            name: 'Nguyễn Thị Thùy',
            birthYear: 2007,
            generation: 5,
            motherId: 'SP14'
        }
    }
}