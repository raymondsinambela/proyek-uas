import unittest
from backend.engine.obe_elemen import metode_obe
from backend.engine.obe_persamaan import selesaikan_persamaan, buat_matriks_dari_persamaan


class TestOBE(unittest.TestCase):
    def test_rref_augmented(self):
        A = [[2, 1, 5], [1, -1, 1]]
        result = metode_obe(A)["hasil"]
        self.assertAlmostEqual(result[0][0], 1)
        self.assertAlmostEqual(result[0][1], 0)
        self.assertAlmostEqual(result[0][2], 2)
        self.assertAlmostEqual(result[1][0], 0)
        self.assertAlmostEqual(result[1][1], 1)
        self.assertAlmostEqual(result[1][2], 1)

    def test_word_equation_parser(self):
        matrix, variables = buat_matriks_dari_persamaan(
            ["2x+3y=19000", "3x+2y=21000"]
        )
        self.assertEqual(variables, ["x", "y"])
        self.assertEqual(len(matrix), 2)

    def test_solve_equations(self):
        result = selesaikan_persamaan(
            ["2x+3y=19000", "3x+2y=21000"]
        )
        self.assertEqual(result["status"], "solusi_tunggal")
        self.assertAlmostEqual(result["solusi"]["x"], 5000)
        self.assertAlmostEqual(result["solusi"]["y"], 3000)

    def test_inconsistent_system(self):
        result = selesaikan_persamaan(["x+y=2", "x+y=5"])
        self.assertEqual(result["status"], "tidak_ada_solusi")

    def test_ragged_matrix_rejected(self):
        with self.assertRaises(ValueError):
            metode_obe([[1, 2], [3]])


if __name__ == "__main__":
    unittest.main()