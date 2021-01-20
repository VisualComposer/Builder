<?php

class HelpersDifferTest extends WP_UnitTestCase
{
    public function testDifferSet()
    {
        $differ = vchelper('Differ');
        $differ->set(
            [
                'test' => 1,
            ]
        );

        $this->assertEquals(['test' => 1], $differ->get());
    }

    public function testDifferSetMultiple()
    {
        $differ = vchelper('Differ');
        $differ->set(
            [
                'test' => 1,
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
            ]
        );

        $this->assertEquals(['test' => 1, 'test2' => 2, 'test3' => 3, 'test4' => 4], $differ->get());
    }

    public function testDifferDoubleSet()
    {
        $differ = vchelper('Differ');
        $old = ['test' => 1, 'test2' => 2];
        $new = ['test3' => 3, 'test2' => 2, 'test4' => 4];

        $differ->set($old);
        $differ->set($new);

        $this->assertEquals(['test' => 1, 'test2' => 2, 'test3' => 3, 'test4' => 4], $differ->get());
    }

    public function testDifferDoubleSet2()
    {
        $differ = vchelper('Differ');
        $old = ['test' => 1, 'test2' => 2];
        $new = ['test3' => 3, 'test2' => 3, 'test4' => 4];

        $differ->set($old);
        $differ->set($new);

        $this->assertEquals(['test' => 1, 'test2' => 3, 'test3' => 3, 'test4' => 4], $differ->get());
    }

    public function testDifferDoubleSet3()
    {
        $differ = vchelper('Differ');
        $old = ['test' => 1, 'test2' => 2];
        $new = ['test3' => 3];

        $differ->set($old);
        $differ->set($new);

        $this->assertEquals(['test' => 1, 'test2' => 2, 'test3' => 3], $differ->get());
    }

    public function testDifferDoubleSet4()
    {
        $differ = vchelper('Differ');
        $old = ['test' => 1, 'test2' => 2];
        $new = ['test2' => 3];

        $differ->set($old);
        $differ->set($new);

        $this->assertEquals(['test' => 1, 'test2' => 3], $differ->get());
    }

    public function testDifferSetMultipleTwice()
    {
        $differ = vchelper('Differ');
        $differ->set(
            [
                'test' => 1,
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
            ]
        );
        $differ->set(
            [
                'test' => 1,
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
            ]
        );

        $this->assertEquals(['test' => 1, 'test2' => 2, 'test3' => 3, 'test4' => 4], $differ->get());
    }

    public function testDifferSetMultipleUpdateCallbackOnEqual()
    {
        $differ = vchelper('Differ');
        $differ->set(
            [
                'test' => 1,
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
            ]
        );
        $onUpdate = function ($key, $prev, $new, $merged) {
            $merged *= 2;

            return $merged;
        };
        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test' => 1,
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
            ]
        );

        // Due to new value is equals to previous value, there is no update at all
        $this->assertEquals(['test' => 1, 'test2' => 2, 'test3' => 3, 'test4' => 4], $differ->get());
    }

    public function testDifferSetMultipleUpdateCallback()
    {
        $differ = vchelper('Differ');
        $differ->set(
            [
                'test' => 1,
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
            ]
        );
        $onUpdate = function ($key, $prev, $new, $merged) {
            $merged *= 2;

            return $merged;
        };
        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test2' => 2,
                'test3' => 3,
                'test4' => 4,
                'test5' => 5,
            ]
        );

        // Due to new value is different from previous value, all new values will be considered as updated
        $this->assertEquals(['test' => 1, 'test2' => 4, 'test3' => 6, 'test4' => 8, 'test5' => 10], $differ->get());
    }

    public function testExceptEmptyAlwaysDifferSet()
    {
        $this->assertEquals([], vchelper('Differ')->get());
        $this->assertEquals(['test' => 1, 'test2' => 2], vchelper('Differ')->set(['test' => 1, 'test2' => 2])->get());
        $this->assertEquals([], vchelper('Differ')->get());
    }

    public function testUpdateCallbackFirst()
    {
        $onUpdate = function ($key, $prev, $new, $merged) {
            return $merged * 2;
        };

        $differ = vchelper('Differ');
        $differ->onUpdate($onUpdate);
        $differ->set(['test1' => 1, 'test2' => 2, 'test3' => 3]);

        $this->assertEquals(['test1' => 2, 'test2' => 4, 'test3' => 6], $differ->get());
    }

    public function testDifferUpdateCallbacks()
    {
        $onUpdate = function ($key, $prevValue, $newValue, $mergedValue) {
            /* Just some calculations */
            foreach ($newValue as $innerKey => $item) {
                // Only if it was existed before
                if (array_key_exists($innerKey, $prevValue)) {
                    $mergedValue[ $innerKey ] = $item * 2;
                }
            }

            return $mergedValue;
        };

        $differ = vchelper('Differ');

        $differ->set(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 2,
                ],
                'test2' => [
                    'c' => 3,
                    'd' => 4,
                ],
                'test3' => [
                    'e' => 5,
                    'f' => 6,
                ],
            ]
        );

        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test2' => [
                    'e' => 5,
                    'f' => 6,
                    'd' => 5,
                ],
                'test4' => [
                    'g' => 7,
                    'h' => 8,
                ],
            ]
        );

        $this->assertEquals(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 2,
                ],
                'test2' => [
                    'c' => 3,
                    'd' => 10, // 5*2 modified

                    // New
                    'e' => 5,
                    'f' => 6,
                ],
                'test3' => [
                    'e' => 5,
                    'f' => 6,
                ],
                'test4' => [
                    'g' => 7,
                    'h' => 8,
                ],
            ],
            $differ->get()
        );
    }

    public function testUpdateCallbacks()
    {
        $onUpdate = function ($key, $prevValue, $newValue, $mergedValue) {
            /* Just some calculations */
            foreach ($newValue as $innerKey => $item) {
                // Only if it was existed before
                if (array_key_exists($innerKey, $prevValue)) {
                    $mergedValue[ $innerKey ] = $item * 2;
                }
            }

            return $mergedValue;
        };

        $differ = vchelper('Differ');

        $differ->set(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 2,
                ],
            ]
        );

        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test1' => [
                    'b' => 3,
                    'c' => 4,
                    'd' => 5,
                ],
            ]
        );

        $this->assertEquals(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 6,
                    'c' => 4,
                    'd' => 5,
                ],
            ],
            $differ->get()
        );
    }

    public function testUpdateCallbacksChangeKeys()
    {
        $onUpdate = function ($key, $prevValue, $newValue, $mergedValue) {
            /* Just some calculations */
            foreach ($newValue as $innerKey => $item) {
                // Only if it was existed before
                if (array_key_exists($innerKey, $prevValue)) {
                    $mergedValue[ $innerKey . '_updated' ] = $item * 2;
                }
            }

            return $mergedValue;
        };

        $differ = vchelper('Differ');

        $differ->set(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 2,
                ],
            ]
        );

        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test1' => [
                    'b' => 3,
                    'c' => 4,
                    'd' => 5,
                ],
            ]
        );

        $this->assertEquals(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 3,
                    'b_updated' => 6,
                    'c' => 4,
                    'd' => 5,
                ],
            ],
            $differ->get()
        );
    }

    public function testUpdateCallbacksUnset()
    {
        $onUpdate = function ($key, $prevValue, $newValue, $mergedValue) {
            /* Just some calculations */
            foreach ($newValue as $innerKey => $item) {
                // Only if it was existed before
                if (array_key_exists($innerKey, $prevValue)) {
                    unset($mergedValue[ $innerKey ]);
                }
            }

            return $mergedValue;
        };

        $differ = vchelper('Differ');

        $differ->set(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 2,
                ],
            ]
        );

        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test1' => [
                    'b' => 3,
                    'c' => 4,
                    'd' => 5,
                ],
            ]
        );

        $this->assertEquals(
            [
                'test1' => [
                    'a' => 1,
                    'c' => 4,
                    'd' => 5,
                ],
            ],
            $differ->get()
        );
    }

    public function testUpdateCallbacksUnsetAndChangeKeys()
    {
        $onUpdate = function ($key, $prevValue, $newValue, $mergedValue) {
            /* Just some calculations */
            foreach ($newValue as $innerKey => $item) {
                // Only if it was existed before
                if (array_key_exists($innerKey, $prevValue)) {
                    unset($mergedValue[ $innerKey ]);
                    $mergedValue[ $innerKey . '_updated' ] = $item * 2;
                    $mergedValue[ $innerKey . '_previous' ] = $prevValue[ $innerKey ];
                    $mergedValue[ $innerKey . '_new' ] = $item;
                }
            }

            return $mergedValue;
        };

        $differ = vchelper('Differ');

        $differ->set(
            [
                'test1' => [
                    'a' => 1,
                    'b' => 2,
                ],
            ]
        );

        $differ->onUpdate($onUpdate);
        $differ->set(
            [
                'test1' => [
                    'b' => 3,
                    'c' => 4,
                    'd' => 5,
                ],
            ]
        );

        $this->assertEquals(
            [
                'test1' => [
                    'a' => 1,
                    'c' => 4,
                    'd' => 5,
                    'b_previous' => 2,
                    'b_new' => 3,
                    'b_updated' => 6,
                ],
            ],
            $differ->get()
        );
    }

    public function testDifferNonArrays()
    {
        $differ = vchelper('Differ');
        $this->expectException('InvalidArgumentException');
        $differ->set([1, 2, 3]);
    }

    public function testDifferNonArrays2()
    {
        $differ = vchelper('Differ');
        $differ->set(['a' => 1]);
        // CAN Set empty value, it will not affect anything
        $differ->set([]);

        $this->assertEquals(['a' => 1], $differ->get());
    }

    public function testDifferAssoc()
    {
        $differ = vchelper('Differ');
        $differ->set(['a' => ['b' => 'a', 'test' => 1, 'test2' => true]]);
        $differ->set(['a' => ['a' => 'a', 'test' => 1, 'test2' => true]]);
        $this->assertEquals(['a' => ['b' => 'a', 'a' => 'a', 'test' => 1, 'test2' => true]], $differ->get());
    }

    public function testDifferMergeByReplace()
    {
        $differ = vchelper('Differ');
        $differ->optionMergeByReplace(false);
        $differ->set(['a' => ['b' => 'a', 'test' => 1, 'test2' => true]]);
        $differ->set(['a' => ['a' => 'a', 'test' => 1, 'test2' => true]]);
        $this->assertEquals(['a' => ['b' => 'a', 'a' => 'a', 'test' => 1, 'test2' => true]], $differ->get());
    }

    public function testDifferMergeByReplaceTrue()
    {
        $differ = vchelper('Differ');
        $differ->optionMergeByReplace(true);
        $differ->set(['a' => ['b' => 'a', 'test' => 1, 'test2' => true]]);
        $differ->set(['a' => ['a' => 'a', 'test' => 1, 'test2' => true]]);
        $this->assertEquals(['a' => ['a' => 'a', 'test' => 1, 'test2' => true]], $differ->get());
    }
}
