// familyData.js

export const familyData = {
    nodes: {
        // Đời 1 (1 người)
        N1: {
            id: 'N1',
            name: 'Nguyễn Văn A',
            birthYear: 1900,
            generation: 1,
            spouses: [{
                id: 'SP1',
                name: 'Trần Thị B',
                birthYear: 1902,
                marriageYear: 1920
            }]
        },
        // Đời 2 (3 người)
        N2: {
            id: 'N2',
            name: 'Nguyễn Văn C',
            birthYear: 1925,
            generation: 2,
            motherId: 'SP1',
            spouses: [{
                id: 'SP2',
                name: 'Lê Thị D',
                birthYear: 1928,
                marriageYear: 1945
            }]
        },
        N3: {
            id: 'N3',
            name: 'Nguyễn Thị E',
            birthYear: 1927,
            generation: 2,
            motherId: 'SP1'
        },
        N4: {
            id: 'N4',
            name: 'Nguyễn Văn F',
            birthYear: 1930,
            generation: 2,
            motherId: 'SP1',
            spouses: [{
                id: 'SP3',
                name: 'Phạm Thị G',
                birthYear: 1932,
                marriageYear: 1950
            }]
        },
        // Đời 3 (8 người)
        N5: {
            id: 'N5',
            name: 'Nguyễn Văn H',
            birthYear: 1950,
            generation: 3,
            motherId: 'SP2'
        },
        N6: {
            id: 'N6',
            name: 'Nguyễn Thị I',
            birthYear: 1952,
            generation: 3,
            motherId: 'SP2'
        },
        N7: {
            id: 'N7',
            name: 'Nguyễn Văn K',
            birthYear: 1953,
            generation: 3,
            motherId: 'SP2',
            spouses: [{
                id: 'SP4',
                name: 'Hoàng Thị L',
                birthYear: 1955,
                marriageYear: 1975
            }]
        },
        N8: {
            id: 'N8',
            name: 'Nguyễn Văn M',
            birthYear: 1951,
            generation: 3,
            motherId: 'SP3'
        },
        N9: {
            id: 'N9',
            name: 'Nguyễn Thị N',
            birthYear: 1953,
            generation: 3,
            motherId: 'SP3'
        },
        N10: {
            id: 'N10',
            name: 'Nguyễn Văn O',
            birthYear: 1955,
            generation: 3,
            motherId: 'SP3'
        },
        N11: {
            id: 'N11',
            name: 'Nguyễn Văn P',
            birthYear: 1957,
            generation: 3,
            motherId: 'SP3'
        },
        N12: {
            id: 'N12',
            name: 'Nguyễn Thị Q',
            birthYear: 1959,
            generation: 3,
            motherId: 'SP3'
        }
    }
}