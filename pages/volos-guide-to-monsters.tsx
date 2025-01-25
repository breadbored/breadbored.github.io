import { GetStaticProps } from 'next';
import monsters from '../_data/monsters.json';

/**
HP:
    >200: The Truest Challenge
    >100: Challenging
    >75: Caution
    >50: Sturdy
    >25: Resilient
    >12: Lesser
    <11: Common

AC:
    >20: Impenetrable
    >17: Iron-Clad
    >15: Well-Guarded
    >13: Protected
    >11: Exposed
    <=10: Vulnerable
 */

interface PageProps {
    monsters: {
        name: string
        size: string
        type: string
        environment: string[]
        hp: string // this will be referencing the HP scale above
        ac: string // this will be referencing the AC scale above
        alignment: string
    }[]
}

export const getStaticProps: GetStaticProps<PageProps> = async () => {
    return {
        props: {
            monsters: monsters.map((monster) => {
                const ac = monster.ac;
                const hp = monster.hp;
                let stringAc = "Unknown";
                let stringHp = "Unknown";
                if (ac > 20) {
                    stringAc = "Impenetrable";
                } else if (ac > 17) {
                    stringAc = "Iron-Clad";
                } else if (ac > 15) {
                    stringAc = "Well-Guarded";
                } else if (ac > 13) {
                    stringAc = "Protected";
                } else if (ac > 11) {
                    stringAc = "Exposed";
                } else if (ac <= 10) {
                    stringAc = "Vulnerable";
                }
                if (hp > 200) {
                    stringHp = "The Toughest Challenge";
                } else if (hp > 100) {
                    stringHp = "Challenging";
                } else if (hp > 75) {
                    stringHp = "Caution";
                } else if (hp > 50) {
                    stringHp = "Sturdy";
                } else if (hp > 25) {
                    stringHp = "Resilient";
                } else if (hp > 12) {
                    stringHp = "Lesser";
                } else if (hp < 11) {
                    stringHp = "Common";
                }
                return {
                    name: monster.name,
                    size: monster.size,
                    type: monster.type,
                    environment: monster.environment,
                    hp: stringHp,
                    ac: stringAc,
                    alignment: monster.alignment,
                };
            }),
        },
    };
}

const VolosGuideToMonsters = ({
    monsters,
}: PageProps) => {
    return (
        <div>
            <h1 style={{
                textAlign: 'center',
                fontSize: '2rem',
                marginBottom: '1rem',
            }}>Monsters from Volo's Guide to Monsters</h1>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Size</th>
                        <th>Type</th>
                        <th>Environment</th>
                        <th>HP</th>
                        <th>AC</th>
                        <th>Alignment</th>
                    </tr>
                </thead>
                <tbody>
                    {monsters.map((monster) => (
                        <tr key={monster.name}>
                            <td>{monster.name}</td>
                            <td>{monster.size}</td>
                            <td>{monster.type}</td>
                            <td>{monster.environment.join(', ')}</td>
                            <td>{monster.hp}</td>
                            <td>{monster.ac}</td>
                            <td>{monster.alignment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default VolosGuideToMonsters;